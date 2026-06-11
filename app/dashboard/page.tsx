"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FaCloudUploadAlt,
  FaTrash,
  FaDownload,
  FaSpinner,
  FaFileImage,
  FaFileVideo,
  FaFilePdf,
  FaFileAlt,
  FaFilePowerpoint,
  FaFileExcel,
  FaSearch,
  FaThLarge,
  FaListUl,
  FaTimes,
  FaPlay,
  FaEllipsisV,
  FaExclamationCircle,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import {
  getUploadUrl,
  confirmUploadDB,
  listPhotos,
  deletePhoto,
  getDownloadUrl,
  getStorageInfo,
} from "@/actions/drive";
import { Database, HardDrive } from "lucide-react";
import Image from "next/image";

type DriveFile = {
  key: string;
  url: string;
  size?: number;
};

type PhotoItem = {
  key?: string;
  url: string;
  size?: number;
};

type ToastItem = {
  id: string;
  message: string;
  type: "error" | "success" | "info";
};

// Safe ID generator fallback in case you test on a non-HTTPS local IP
const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/* ------------------------------------------------------------------ */
/* Reusable Modern Button Classes                                     */
/* ------------------------------------------------------------------ */
const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 py-2.5 px-5 font-semibold text-sm cursor-pointer bg-green-800 text-white hover:bg-green-700 rounded-lg transition-all duration-200 active:scale-95";

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 py-2 px-6 font-semibold text-md bg-blue-700 text-white cursor-pointer cursor-pointer rounded-lg transition-all duration-200 ";

const dangerButtonClass =
  "inline-flex items-center justify-center gap-2 py-1 px-4 font-semibold text-md bg-red-500 text-white cursor-pointer hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

const iconButtonClass =
  "p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer outline-none active:scale-95";

/* ------------------------------------------------------------------ */
/* Toast Notification Component                                       */
/* ------------------------------------------------------------------ */
function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  const config = {
    error: {
      bg: "bg-red-950/90",
      border: "border-red-500/50",
      icon: (
        <FaExclamationCircle
          className="text-red-400 shrink-0 mt-0.5"
          size={16}
        />
      ),
    },
    success: {
      bg: "bg-emerald-950/90",
      border: "border-emerald-500/50",
      icon: (
        <FaCheckCircle className="text-emerald-400 shrink-0 mt-0.5" size={16} />
      ),
    },
    info: {
      bg: "bg-blue-950/90",
      border: "border-blue-500/50",
      icon: (
        <FaInfoCircle className="text-blue-400 shrink-0 mt-0.5" size={16} />
      ),
    },
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[200] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const c = config[toast.type];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto backdrop-blur-md ${c.bg} border ${c.border} shadow-2xl rounded-lg overflow-hidden animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)] flex flex-col`}
          >
            <div className="flex items-start gap-3 px-4 py-3.5">
              {c.icon}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-gray-100 leading-snug break-words">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors shrink-0"
              >
                <FaTimes size={14} />
              </button>
            </div>
            <div className="h-1 w-full bg-black/20 origin-left animate-[shrink_5s_linear_forwards]" />
          </div>
        );
      })}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reusable Action Menu (kebab ⋮ dropdown)                            */
/* ------------------------------------------------------------------ */
function ActionMenu({
  fileKey,
  onDownload,
  onDelete,
}: {
  fileKey: string;
  onDownload: (e: React.MouseEvent, key: string) => void;
  onDelete: (e: React.MouseEvent, key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className={`${iconButtonClass} bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-white/20`}
        aria-label="File actions"
      >
        <FaEllipsisV size={14} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-[100] min-w-[160px] bg-[#18181b] backdrop-blur-xl border border-white/10 shadow-2xl py-1.5 flex flex-col rounded-lg overflow-hidden animate-[fadeIn_0.15s_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              onDownload(e, fileKey);
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium cursor-pointer text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
          >
            <FaDownload size={14} className="text-gray-400" />
            Download
          </button>
          <div className="w-full h-px bg-white/10 my-1" />
          <button
            type="button"
            onClick={(e) => {
              onDelete(e, fileKey);
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <FaTrash size={14} />
            Delete
          </button>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(-5px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function DriveManager() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageLimit, setStorageLimit] = useState(0);
  const [maxFileSize, setMaxFileSize] = useState(0); // NEW
  const [fileCountLimit, setFileCountLimit] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback(
    (message: string, type: ToastItem["type"] = "error") => {
      const id = generateId(); // Safe ID fallback
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    [],
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchStorageInfo = useCallback(async () => {
    try {
      const info = await getStorageInfo();
      if (info) {
        setStorageUsed(info.used || 0);
        setStorageLimit(info.limit || 0);
        setMaxFileSize(info.maxFileSize || 0); // NEW
        setFileCountLimit(info.fileCountLimit || 0); // NEW
      }
    } catch (e) {
      console.error("Failed to fetch storage info", e);
    }
  }, []);

  const fetchFiles = useCallback(
    async (pageNum = 0, replace = false) => {
      if (replace) setIsLoading(true);
      else setIsLoadingMore(true);

      try {
        const data = await listPhotos(pageNum);
        const mapped = data.files.map((item: PhotoItem) => ({
          key: item.key || item.url,
          url: item.url,
          size: item.size,
        }));

        setFiles((prev) => (replace ? mapped : [...prev, ...mapped]));
        setHasMore(data.hasMore);
        setTotalFiles(data.total);
        setPage(pageNum);
      } catch (error) {
        console.error("Failed to fetch:", error);
        showToast("Failed to load files. Please try again.", "error");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    fetchFiles(0, true);
    fetchStorageInfo();
  }, [fetchFiles, fetchStorageInfo]);

  const handleLoadMore = () => fetchFiles(page + 1, false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    // --- NEW: pre-validate against the dynamic plan limits ---
    const incoming = Array.from(selectedFiles);
    const accepted: File[] = [];
    let projectedUsed = storageUsed;
    let projectedCount = totalFiles;

    for (const file of incoming) {
      if (maxFileSize > 0 && file.size > maxFileSize) {
        showToast(
          `${file.name} — over the ${formatBytes(maxFileSize)} per-file limit.`,
          "error",
        );
      } else if (fileCountLimit > 0 && projectedCount + 1 > fileCountLimit) {
        showToast(
          `${file.name} — file count limit reached (${fileCountLimit}).`,
          "error",
        );
      } else if (storageLimit > 0 && projectedUsed + file.size > storageLimit) {
        showToast(`${file.name} — not enough storage remaining.`, "error");
      } else {
        accepted.push(file);
        projectedUsed += file.size;
        projectedCount += 1;
      }
    }

    if (accepted.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    // --- end new block ---

    setIsUploading(true);

    let successCount = 0;
    const failedItems: { name: string; reason: string }[] = [];

    try {
      const uploadPromises = accepted.map(async (file) => {
        try {
          const { url, fields, key } = await getUploadUrl(
            file.name,
            file.type,
            file.size,
          );

          const formData = new FormData();
          // Ensure fields are appended correctly
          Object.entries(fields).forEach(([k, v]) =>
            formData.append(k, String(v)),
          );
          // File MUST be the last field appended
          formData.append("file", file);

          const response = await fetch(url, {
            method: "POST",
            body: formData,
          });

          if (!response.ok && response.status !== 204) {
            throw new Error(`Upload failed with status ${response.status}`);
          }

          await confirmUploadDB(key, file.name, file.size, file.type);
          successCount++;
        } catch (error) {
          console.error("File upload error:", error);
          const reason =
            error instanceof Error ? error.message : "Network error";
          failedItems.push({ name: file.name, reason });
        }
      });

      await Promise.all(uploadPromises);

      // Handle Success
      if (successCount > 0) {
        showToast(
          successCount === 1
            ? "File uploaded successfully."
            : `${successCount} files uploaded successfully.`,
          "success",
        );
      }

      // Handle Failures
      if (failedItems.length > 0) {
        const reasonGroups = new Map<string, string[]>();
        for (const item of failedItems) {
          const existing = reasonGroups.get(item.reason) || [];
          existing.push(item.name);
          reasonGroups.set(item.reason, existing);
        }
        for (const [reason, names] of Array.from(reasonGroups.entries())) {
          const fileLabel =
            names.length === 1 ? names[0] : `${names.length} files`;
          showToast(`${fileLabel} — ${reason}`, "error");
        }
      }

      await fetchFiles(0, true);
      await fetchStorageInfo();
    } catch (criticalError) {
      console.error("Critical upload failure", criticalError);
      showToast("An unexpected error occurred during upload.", "error");
    } finally {
      // ALWAYS reset state, even if a crash occurs
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteClick = useCallback((e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setFileToDelete(key);
  }, []);

  const confirmDelete = async () => {
    if (!fileToDelete) return;
    const fileObj = files.find((f) => f.key === fileToDelete);
    if (!fileObj) return;

    const key = fileToDelete;
    const fileName = key.split("/").pop() || key;
    setFileToDelete(null);
    setFiles((prev) => prev.filter((p) => p.key !== key));
    if (selectedFile?.key === key) setSelectedFile(null);
    setTotalFiles((t) => Math.max(0, t - 1));

    try {
      await deletePhoto(key);
      await fetchStorageInfo();
      showToast(`"${fileName}" deleted successfully.`, "success");
    } catch (error) {
      console.error("Delete failed", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to delete file. Please try again.",
        "error",
      );
      fetchFiles(0, true);
      fetchStorageInfo();
    }
  };

  const handleDownload = useCallback(
    async (e: React.MouseEvent, key: string) => {
      e.stopPropagation();
      try {
        const downloadUrl = await getDownloadUrl(key);
        const link = document.createElement("a");
        link.href = downloadUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Download failed", error);
        showToast("Failed to initiate download.", "error");
      }
    },
    [showToast],
  );

  const getFileName = (key: string) => key.split("/").pop() || key;
  const getFileExtension = (fileName: string) =>
    fileName.split(".").pop()?.toLowerCase() || "UNKNOWN";

  const getFileType = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    if (["mp4", "webm", "ogg", "mov"].includes(ext)) return "video";
    if (["pdf"].includes(ext)) return "pdf";
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
      return "image";
    if (["pptx", "ppt"].includes(ext)) return "presentation";
    if (["xlsx", "xls", "csv"].includes(ext)) return "spreadsheet";
    if (["md", "txt"].includes(ext)) return "text";
    return "other";
  };

  const getFileIcon = (type: string, className: string) => {
    switch (type) {
      case "video":
        return <FaFileVideo className={className} />;
      case "pdf":
        return <FaFilePdf className={className} />;
      case "image":
        return <FaFileImage className={className} />;
      case "presentation":
        return <FaFilePowerpoint className={className} />;
      case "spreadsheet":
        return <FaFileExcel className={className} />;
      default:
        return <FaFileAlt className={className} />;
    }
  };

  const filteredFiles = files.filter((file) =>
    getFileName(file.key).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen bg-[#09090b] text-gray-100 flex flex-col  selection:bg-blue-500/30">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* --- Sticky Header & Command Bar --- */}
      <div className="  z-40 bg-[#09090b] border-b border-white/10">
        <div className="max-w-[1600px] mx-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-slate-800  rounded-lg flex items-center justify-center shrink-0 shadow-inner">
                <HardDrive size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
                  My Drive
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  Manage and review your secure files
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:w-auto w-full">
              <div className="relative flex-1 sm:w-64">
                <FaSearch
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search files and more.."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#12121b] border border-white/10 rounded-lg text-md text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 z-10 flex flex-col gap-8">
        {/* Essentials Dashboard Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#12121b] border border-[#444444] rounded-lg p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-md text-gray-200 font-medium">
              Total Resources
            </span>
            <span className="text-2xl font-bold text-white">{totalFiles}</span>
          </div>
          <div className="bg-[#12121b] border border-[#444444] rounded-lg p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-md text-gray-200 font-medium">
              Storage Used
            </span>
            <span className="text-2xl font-bold text-blue-500">
              {formatBytes(storageUsed)}
            </span>
          </div>
          <div className="bg-[#12121b] border border-[#444444] rounded-lg p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-md text-gray-200 font-medium">Capacity</span>
            <span className="text-2xl font-bold text-white">
              {formatBytes(storageLimit)}
            </span>
          </div>
          <div className="bg-[#12121b] border border-[#444444] rounded-lg p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-md text-gray-200 font-medium">
              System Status
            </span>
            <div className="flex items-center gap-2 text-white bg-green-700 w-fit px-2.5 py-1 rounded-md text-sm font-semibold">
              <Database size={14} /> Online
            </div>
          </div>
        </div>

        {/* --- Toolbar --- */}
        <div className="flex flex-wrap items-center justify-between gap-4  rounded-lg ">
          <div className="flex items-center gap-3 pl-2">
            <div className="flex items-center ">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-green-700 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
                title="Grid View"
              >
                <FaThLarge size={24} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-green-700 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
                title="List View"
              >
                <FaListUl size={24} />
              </button>
            </div>
          </div>

          <div className="pr-2 flex items-center">
            <input
              type="file"
              accept="image/*,video/*,application/pdf,.pptx,.ppt,.xlsx,.xls,.csv,.txt,.md"
              className="hidden"
              ref={fileInputRef}
              onChange={handleUpload}
              disabled={isUploading}
              multiple
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={primaryButtonClass}
            >
              {isUploading ? (
                <FaSpinner className="animate-spin" size={22} />
              ) : (
                <FaCloudUploadAlt size={22} />
              )}
              <span className="hidden sm:inline">
                {isUploading ? "Uploading..." : "Upload Files"}
              </span>
              <span className="sm:hidden">
                {isUploading ? "Uploading..." : "Upload"}
              </span>
            </button>
          </div>
        </div>

        {/* Content View */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-32 gap-4">
            <FaSpinner className="animate-spin text-blue-500" size={32} />
            <span className="text-sm font-medium text-gray-400">
              Loading your files...
            </span>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-32  border border-dashed border-white/10 rounded-lg text-center px-4">
            <div className="w-16 h-16 bg-white/5 flex items-center justify-center rounded-lg mb-4">
              <FaCloudUploadAlt className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              No files found
            </h3>
            <p className="text-sm text-gray-400 max-w-sm mb-6">
              Your drive is empty or no files match your search. Upload
              documents, images, or media to get started.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={secondaryButtonClass}
            >
              Select files to upload
            </button>
          </div>
        ) : (
          <div className=" overflow-hidden flex flex-col">
            {viewMode === "list" ? (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse  whitespace-nowrap">
                  <thead className="bg-[#18181b] border-b border-white/10  text-sm font-semibold text-green-500  tracking-wider">
                    <tr>
                      <th className="px-6 py-4 w-16 text-center">Type</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4 w-32 hidden sm:table-cell">
                        Extension
                      </th>
                      <th className="px-6 py-4 w-24 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredFiles.map((file) => {
                      const fileName = getFileName(file.key);
                      const fileType = getFileType(fileName);
                      const ext = getFileExtension(fileName);
                      return (
                        <tr
                          key={file.key}
                          onClick={() => setSelectedFile(file)}
                          className="hover:bg-white/5 cursor-pointer transition-colors group"
                        >
                          <td className="px-6 py-4 text-center">
                            {getFileIcon(
                              fileType,
                              "text-xl text-white group-hover:text-green-400 transition-colors mx-auto",
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-200 font-medium truncate max-w-[200px] md:max-w-md group-hover:text-white transition-colors">
                            {fileName}
                            <span className="block sm:hidden text-xs text-green-500 mt-1 font-normal">
                              {ext.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden sm:table-cell">
                            <span className="bg-green-700 text-white px-2.5 py-1 text-xs font-medium rounded-lg">
                              {ext.toUpperCase()}
                            </span>
                          </td>
                          <td
                            className="px-6 py-4 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex justify-end">
                              <ActionMenu
                                fileKey={file.key}
                                onDownload={handleDownload}
                                onDelete={handleDeleteClick}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {filteredFiles.map((file) => {
                  const fileName = getFileName(file.key);
                  const fileType = getFileType(fileName);
                  const ext = getFileExtension(fileName);
                  return (
                    <div
                      key={file.key}
                      onClick={() => setSelectedFile(file)}
                      className="group relative bg-[#09090b] transition-all border-2 border-[#444444] duration-300 cursor-pointer flex flex-col rounded-xl overflow-hidden"
                    >
                      <div
                        className="absolute top-2 right-2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ActionMenu
                          fileKey={file.key}
                          onDownload={handleDownload}
                          onDelete={handleDeleteClick}
                        />
                      </div>
                      <div className="aspect-square bg-[#121214] border-b border-white/5 flex items-center justify-center relative overflow-hidden">
                        {fileType === "image" ? (
                          <Image
                            src={file.url}
                            alt={fileName}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            loading="lazy"
                          />
                        ) : fileType === "video" ? (
                          <div className="w-full h-full relative">
                            <video
                              src={file.url}
                              preload="none"
                              muted
                              playsInline
                              className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                                <FaPlay className="text-white ml-1" size={14} />
                              </div>
                            </div>
                          </div>
                        ) : (
                          getFileIcon(
                            fileType,
                            "text-4xl text-white group-hover:text-green-500 transition-colors duration-300 scale-95 group-hover:scale-100",
                          )
                        )}
                      </div>
                      <div className="p-3.5 flex flex-col gap-1">
                        <span
                          className="text-sm font-medium text-gray-200 group-hover:text-white truncate transition-colors"
                          title={fileName}
                        >
                          {fileName}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {ext.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {hasMore && (
              <div className="border-t border-white/10 bg-[#18181b] p-4 text-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className={secondaryButtonClass}
                >
                  {isLoadingMore ? (
                    <>
                      <FaSpinner className="animate-spin" size={14} />{" "}
                      Loading...
                    </>
                  ) : (
                    "Load more files"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- File Viewer Overlay (Modal) --- */}
      {selectedFile && (
        <div
          className="fixed inset-0 z-[150] bg-black/90 flex flex-col backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className="bg-black/50 border-b border-white/10 px-4 py-4 flex justify-between items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 min-w-0">
              {getFileIcon(
                getFileType(getFileName(selectedFile.key)),
                "text-blue-400 text-xl shrink-0",
              )}
              <span className="text-base font-semibold text-gray-100 truncate">
                {getFileName(selectedFile.key)}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <button
                type="button"
                onClick={(e) => handleDownload(e, selectedFile.key)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 cursor-pointer bg-white text-black text-sm font-medium rounded-lg transition-all active:scale-95"
              >
                <FaDownload size={14} /> Download
              </button>
              <button
                type="button"
                onClick={(e) => handleDeleteClick(e, selectedFile.key)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 cursor-pointer bg-red-500 text-white text-red-500 text-sm font-medium rounded-lg transition-all active:scale-95"
              >
                <FaTrash size={14} /> Delete
              </button>
              <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block" />
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="p-2 text-gray-200 bg-blue-800  rounded-lg cursor-pointer transition-all active:scale-95"
                title="Close Viewer"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>
          <div
            className="flex-1 overflow-hidden p-4 md:p-8 flex items-center justify-center relative" // Added 'relative' here
            onClick={(e) => e.stopPropagation()}
          >
            {getFileType(getFileName(selectedFile.key)) === "image" && (
              <Image
                src={selectedFile.url}
                alt="preview"
                fill
                sizes="100vw"
                className="object-contain p-4 md:p-8 drop-shadow-2xl"
              />
            )}
            {getFileType(getFileName(selectedFile.key)) === "video" && (
              <video
                src={selectedFile.url}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg bg-black ring-1 ring-white/10"
              />
            )}
            {getFileType(getFileName(selectedFile.key)) === "pdf" && (
              <iframe
                src={selectedFile.url}
                className="w-full h-full max-w-5xl bg-white rounded-lg ring-1 ring-white/10"
              />
            )}
            {!["image", "video", "pdf"].includes(
              getFileType(getFileName(selectedFile.key)),
            ) && (
              <div className="bg-[#18181b] p-8 md:p-12 border border-white/10 shadow-2xl rounded-lg text-center flex flex-col items-center max-w-md w-full">
                <div className="mb-6 w-20 h-20 bg-white/5 rounded-lg flex items-center justify-center">
                  {getFileIcon(
                    getFileType(getFileName(selectedFile.key)),
                    "text-5xl text-blue-500",
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Preview not available
                </h3>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                  This file format requires a dedicated application to view.
                  Please download it to your device to open it.
                </p>
                <button
                  type="button"
                  onClick={(e) => handleDownload(e, selectedFile.key)}
                  className={`${primaryButtonClass} w-full`}
                >
                  <FaDownload size={16} /> Download File
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Dialog --- */}
      {fileToDelete && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setFileToDelete(null)}
        >
          <div
            className="bg-[#18181b] border border-white/10 shadow-2xl w-full max-w-md rounded-lg overflow-hidden animate-[slideUp_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                  <FaExclamationCircle size={20} className="text-red-500" />
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-bold text-white mb-2">
                    Delete Resource
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Are you sure you want to permanently delete{" "}
                    <span className="font-semibold text-gray-200 break-all">
                      &quot;{getFileName(fileToDelete)}&quot;
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-black/20 px-6 py-4 border-t border-white/5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className={secondaryButtonClass}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className={dangerButtonClass}
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
