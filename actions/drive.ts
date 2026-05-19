"use server";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3";
import { auth, currentUser } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate_limit";

const FILE_LIST_PAGE_SIZE = 30;
const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024;

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/heic",
  "image/heif",
  "image/bmp",
  "image/tiff",
  "image/x-icon",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.oasis.opendocument.text",
  "application/rtf",
  "text/plain",
  "text/csv",
  "text/markdown",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.oasis.opendocument.presentation",
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/vnd.rar",
  "application/x-7z-compressed",
  "application/gzip",
  "application/x-tar",
  "application/x-bzip2",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/aac",
  "audio/flac",
  "audio/x-m4a",
  "audio/mp4",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
  "video/x-matroska",
  "video/mpeg",
  "application/json",
  "application/xml",
  "text/xml",
]);

const getBucketName = () => {
  const bucket = process.env.BUCKET_NAME;
  if (!bucket) throw new Error("Server configuration error.");
  return bucket;
};

function toNum(v: unknown): number {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "bigint") return Number(v);
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function sanitizeFilename(raw: string): string {
  let s = raw
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[.\-]+/, "")
    .replace(/[.\-]+$/, "");
  if (!s) s = "file";
  if (s.length > 200) s = s.slice(0, 200);
  return s;
}

type DbUser = {
  id: string;
  storage_used: string | number | bigint;
  file_count: string | number | bigint;
  plan_id: string;
  plan_storage_limit: string | number | bigint;
  plan_file_count_limit: string | number | bigint;
};

const selectUser = (clerkId: string) => sql`
  SELECT
    u.id,
    u.storage_used,
    u.file_count,
    u.plan_id,
    p.storage_limit    AS plan_storage_limit,
    p.file_count_limit AS plan_file_count_limit
  FROM users u
  JOIN plans p ON u.plan_id = p.id
  WHERE u.clerk_id = ${clerkId}
`;

async function getDbUser(clerkId: string): Promise<DbUser> {
  const rows = await selectUser(clerkId);
  if (rows.length > 0) return rows[0] as DbUser;

  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Unauthorized");

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) throw new Error("No email found on Clerk user");

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

  await sql`
    INSERT INTO users (clerk_id, email, name, avatar_url)
    VALUES (${clerkId}, ${email}, ${name}, ${clerkUser.imageUrl ?? null})
    ON CONFLICT (clerk_id) DO NOTHING
  `;

  const retry = await selectUser(clerkId);
  if (retry.length === 0) throw new Error("User provision failed");
  return retry[0] as DbUser;
}

// 1. Presigned POST URL
export async function getUploadUrl(
  fileName: string,
  contentType: string,
  fileSize: number,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await checkRateLimit(userId, "upload");

  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new Error(
      "File type not allowed. Supported: images, documents, spreadsheets, presentations, archives, audio, and video.",
    );
  }

  if (
    !Number.isFinite(fileSize) ||
    fileSize <= 0 ||
    fileSize > MAX_FILE_SIZE_BYTES
  ) {
    throw new Error(
      `Invalid file size. Maximum allowed is ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`,
    );
  }

  const user = await getDbUser(userId);

  const planFileLimit = toNum(user.plan_file_count_limit);
  if (toNum(user.file_count) >= planFileLimit) {
    throw new Error(
      `Upload blocked. Your ${user.plan_id} plan is limited to ${planFileLimit} files.`,
    );
  }

  const planStorageLimit = toNum(user.plan_storage_limit);
  if (toNum(user.storage_used) + fileSize > planStorageLimit) {
    const limitInGb = Math.round(planStorageLimit / (1024 * 1024 * 1024));
    throw new Error(
      `Storage limit exceeded. Your ${user.plan_id} plan allows ${limitInGb} GB max.`,
    );
  }

  const sanitized = sanitizeFilename(fileName);
  const key = `uploads/${userId}/${Date.now()}-${sanitized}`;

  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: getBucketName(),
    Key: key,
    Conditions: [
      ["content-length-range", 1, MAX_FILE_SIZE_BYTES],
      ["eq", "$Content-Type", contentType],
    ],
    Fields: { "Content-Type": contentType },
    Expires: 60,
  });

  return { url, fields, key };
}

// 2. Confirm Upload (atomic enforcement of both limits)
export async function confirmUploadDB(
  key: string,
  fileName: string,
  fileSize: number,
  contentType?: string,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  if (!key.startsWith(`uploads/${userId}/`)) throw new Error("Unauthorized");

  await checkRateLimit(userId, "confirm");

  if (contentType && !ALLOWED_CONTENT_TYPES.has(contentType)) {
    await s3Client
      .send(new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }))
      .catch(() => {});
    throw new Error("File type not allowed.");
  }

  let actualSize: number;
  let actualContentType: string | undefined;
  try {
    const head = await s3Client.send(
      new HeadObjectCommand({ Bucket: getBucketName(), Key: key }),
    );
    actualSize = head.ContentLength ?? fileSize;
    actualContentType = head.ContentType;
  } catch {
    throw new Error(
      "File not found in storage. Upload may have failed — please try again.",
    );
  }

  if (actualContentType && !ALLOWED_CONTENT_TYPES.has(actualContentType)) {
    await s3Client
      .send(new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }))
      .catch(() => {});
    throw new Error("Uploaded file type not allowed. File removed.");
  }

  if (actualSize > MAX_FILE_SIZE_BYTES) {
    await s3Client.send(
      new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }),
    );
    throw new Error("File exceeds maximum allowed size. File removed.");
  }

  const user = await getDbUser(userId);
  const planStorageLimit = toNum(user.plan_storage_limit);
  const planFileLimit = toNum(user.plan_file_count_limit);

  const updated = await sql`
    UPDATE users
    SET storage_used = storage_used + ${actualSize},
        file_count   = file_count + 1,
        updated_at   = NOW()
    WHERE id = ${user.id}
      AND storage_used + ${actualSize} <= ${planStorageLimit}
      AND file_count + 1 <= ${planFileLimit}
    RETURNING id
  `;

  if (updated.length === 0) {
    await s3Client
      .send(new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }))
      .catch(() => {});
    throw new Error(
      "Upload blocked: storage or file count limit reached. File removed.",
    );
  }

  try {
    await sql`
      INSERT INTO files (user_id, file_key, original_name, file_size, content_type)
      VALUES (
        ${user.id},
        ${key},
        ${fileName},
        ${actualSize},
        ${actualContentType ?? contentType ?? null}
      )
    `;
  } catch (e) {
    await sql`
      UPDATE users
      SET storage_used = GREATEST(storage_used - ${actualSize}, 0),
          file_count   = GREATEST(file_count - 1, 0),
          updated_at   = NOW()
      WHERE id = ${user.id}
    `.catch(() => {});
    await s3Client
      .send(new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }))
      .catch(() => {});
    throw e;
  }

  return { success: true };
}

// 3. List Files
export async function listPhotos(page = 0) {
  try {
    const { userId } = await auth();
    if (!userId) return { files: [], total: 0, hasMore: false };

    await checkRateLimit(userId, "list");

    const user = await getDbUser(userId);
    const offset = page * FILE_LIST_PAGE_SIZE;

    const files = await sql`
      SELECT
        id,
        file_key      AS key,
        original_name AS name,
        file_size     AS size,
        content_type
      FROM files
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
      LIMIT ${FILE_LIST_PAGE_SIZE}
      OFFSET ${offset}
    `;

    const total = toNum(user.file_count);
    const bucketName = getBucketName();

    const settled = await Promise.allSettled(
      files.map(async (file) => {
        const url = await getSignedUrl(
          s3Client,
          new GetObjectCommand({ Bucket: bucketName, Key: file.key as string }),
          { expiresIn: 900 },
        );
        return {
          id: String(file.id),
          key: String(file.key),
          name: String(file.name),
          size: toNum(file.size),
          content_type:
            file.content_type == null ? null : String(file.content_type),
          url,
        };
      }),
    );

    const filesWithUrls = settled
      .filter(
        (
          r,
        ): r is PromiseFulfilledResult<{
          id: string;
          key: string;
          name: string;
          size: number;
          content_type: string | null;
          url: string;
        }> => r.status === "fulfilled",
      )
      .map((r) => r.value);

    settled.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(
          "listPhotos: presign failed for",
          files[i]?.key,
          r.reason,
        );
      }
    });

    return {
      files: filesWithUrls,
      total,
      hasMore: offset + files.length < total,
    };
  } catch (error) {
    console.error("listPhotos Error:", error);
    return { files: [], total: 0, hasMore: false };
  }
}

// 4. Delete File
export async function deletePhoto(key: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  if (!key.startsWith(`uploads/${userId}/`)) throw new Error("Unauthorized");

  await checkRateLimit(userId, "delete");

  const user = await getDbUser(userId);

  const fileRows = await sql`
    SELECT file_size FROM files
    WHERE file_key = ${key} AND user_id = ${user.id}
  `;

  if (fileRows.length === 0) {
    throw new Error(
      "File not found or you don't have permission to delete it.",
    );
  }

  const actualSize = toNum(fileRows[0].file_size);

  await sql.transaction([
    sql`DELETE FROM files WHERE file_key = ${key} AND user_id = ${user.id}`,
    sql`
      UPDATE users
      SET storage_used = GREATEST(storage_used - ${actualSize}, 0),
          file_count   = GREATEST(file_count - 1, 0),
          updated_at   = NOW()
      WHERE id = ${user.id}
    `,
  ]);

  await s3Client
    .send(new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }))
    .catch((err) => {
      console.error("S3 delete failed (orphan created):", key, err);
    });

  return { success: true };
}

// 5. Download URL
export async function getDownloadUrl(key: string) {
  const { userId } = await auth();
  if (!userId || !key.startsWith(`uploads/${userId}/`)) {
    throw new Error("Unauthorized");
  }

  await checkRateLimit(userId, "download");

  const rows = await sql`
    SELECT f.original_name
    FROM files f
    JOIN users u ON f.user_id = u.id
    WHERE u.clerk_id = ${userId} AND f.file_key = ${key}
    LIMIT 1
  `;

  const original = (rows[0]?.original_name as string | undefined) ?? "download";

  const asciiFallback =
    original.replace(/[^\x20-\x7E]/g, "_").replace(/["\\\r\n]/g, "_") ||
    "download";
  const utf8 = encodeURIComponent(original);
  const contentDisposition = `attachment; filename="${asciiFallback}"; filename*=UTF-8''${utf8}`;

  return await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: getBucketName(),
      Key: key,
      ResponseContentDisposition: contentDisposition,
    }),
    { expiresIn: 60 },
  );
}

// 6. Storage info
export async function getStorageInfo() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        used: 0,
        limit: 0,
        fileCountLimit: 0,
        currentFileCount: 0,
        planId: "free",
      };
    }

    await checkRateLimit(userId, "storage-info");
    const user = await getDbUser(userId);

    return {
      used: toNum(user.storage_used),
      limit: toNum(user.plan_storage_limit),
      fileCountLimit: toNum(user.plan_file_count_limit),
      currentFileCount: toNum(user.file_count),
      planId: String(user.plan_id),
    };
  } catch (error) {
    console.error("getStorageInfo Error:", error);
    return {
      used: 0,
      limit: 0,
      fileCountLimit: 0,
      currentFileCount: 0,
      planId: "free",
    };
  }
}
