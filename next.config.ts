import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pvt-cloud-forme.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ], // <-- Added missing closing bracket for remotePatterns
  }, // <-- Added missing closing brace for images

  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
