"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Folder,
  FileCode2,
  FileText,
  FileJson,
  Image as ImageIcon,
  Terminal,
  FileBox,
  Database,
  File as DefaultFile,
  ArrowLeft,
  RefreshCw,
  Code2,
  FileSymlink,
} from "lucide-react";

// ============================================================================
// Configuration & Types
// ============================================================================

const GITHUB_CONFIG = {
  username: "kinshukjainn",
  repository: "pvtcldstrg",
  branch: "master",
};

interface GithubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

const formatBytes = (bytes: number = 0, decimals = 1) => {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getFileInfo = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  const iconProps = { size: 16, className: "text-gray-500 shrink-0" };

  switch (ext) {
    case "js":
    case "jsx":
      return {
        lang: "JavaScript",
        icon: <FileCode2 {...iconProps} className="text-[#e3c326] shrink-0" />,
      };
    case "ts":
    case "tsx":
      return {
        lang: "TypeScript",
        icon: <FileCode2 {...iconProps} className="text-[#3178c6] shrink-0" />,
      };
    case "json":
      return {
        lang: "JSON",
        icon: <FileJson {...iconProps} className="text-[#666666] shrink-0" />,
      };
    case "html":
      return {
        lang: "HTML",
        icon: <FileCode2 {...iconProps} className="text-[#e34c26] shrink-0" />,
      };
    case "css":
      return {
        lang: "CSS",
        icon: <FileCode2 {...iconProps} className="text-[#563d7c] shrink-0" />,
      };
    case "md":
      return {
        lang: "Markdown",
        icon: <FileText {...iconProps} className="text-[#0078D4] shrink-0" />,
      };
    case "png":
    case "jpg":
    case "svg":
      return {
        lang: "Image",
        icon: <ImageIcon {...iconProps} className="text-[#a012a6] shrink-0" />,
      };
    case "sh":
      return {
        lang: "Shell",
        icon: <Terminal {...iconProps} className="text-[#107c10] shrink-0" />,
      };
    case "sql":
      return {
        lang: "SQL",
        icon: <Database {...iconProps} className="text-[#e38c00] shrink-0" />,
      };
    case "lock":
      return {
        lang: "Lockfile",
        icon: <FileBox {...iconProps} className="text-gray-400 shrink-0" />,
      };
    default:
      return { lang: "File", icon: <DefaultFile {...iconProps} /> };
  }
};

// ============================================================================
// Main Component
// ============================================================================

export default function RepositoryViewer() {
  const [treeData, setTreeData] = useState<GithubTreeItem[]>([]);
  const [isLoadingTree, setIsLoadingTree] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -- View States --
  const [viewMode, setViewMode] = useState<"tree" | "blob">("tree");
  const [currentPath, setCurrentPath] = useState<string>("");

  // -- File Content States --
  const [fileContent, setFileContent] = useState<string>("");
  const [isFileLoading, setIsFileLoading] = useState(false);

  useEffect(() => {
    fetchRepositoryTree();
  }, []);

  const fetchRepositoryTree = async () => {
    setIsLoadingTree(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/git/trees/${GITHUB_CONFIG.branch}?recursive=1`,
        { headers: { Accept: "application/vnd.github.v3+json" } },
      );
      if (!response.ok) throw new Error("Failed to fetch repository tree.");
      const data = await response.json();
      setTreeData(data.tree);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoadingTree(false);
    }
  };

  const fetchFileContent = async (filePath: string) => {
    setIsFileLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/${GITHUB_CONFIG.branch}/${filePath}`,
      );
      if (!response.ok) throw new Error("Failed to load file content.");
      const text = await response.text();
      setFileContent(text);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unknown error reading file",
      );
    } finally {
      setIsFileLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // Navigation
  // --------------------------------------------------------------------------

  const handleNavigate = (path: string, type: "blob" | "tree") => {
    setCurrentPath(path);
    if (type === "tree") {
      setViewMode("tree");
    } else {
      setViewMode("blob");
      fetchFileContent(path);
    }
  };

  const jumpToPath = (path: string) => {
    setCurrentPath(path);
    setViewMode("tree");
  };

  const navigateUp = () => {
    const pathParts = currentPath.split("/");
    pathParts.pop();
    jumpToPath(pathParts.join("/"));
  };

  // Filter items for current directory view
  const currentItems = useMemo(() => {
    const items = treeData.filter((item) => {
      if (currentPath === "" || viewMode === "blob") {
        return !item.path.includes("/");
      } else {
        const prefix = currentPath + "/";
        if (!item.path.startsWith(prefix)) return false;
        return !item.path.slice(prefix.length).includes("/");
      }
    });

    return items.sort((a, b) => {
      if (a.type === b.type) return a.path.localeCompare(b.path);
      return a.type === "tree" ? -1 : 1;
    });
  }, [treeData, currentPath, viewMode]);

  return (
    <div className="min-h-screen bg-black text-gray-100 ">
      {/* PAGE HEADER */}
      <div className="bg-black border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center shrink-0">
              <Code2 size={30} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl  font-semibold text-gray-100 tracking-tight leading-tight">
                {GITHUB_CONFIG.username} / {GITHUB_CONFIG.repository}
              </h1>
              <p className="text-[13px] text-gray-200 mt-0.5">
                Browsing branch:{" "}
                <span className="font-semibold">{GITHUB_CONFIG.branch}</span>
              </p>
            </div>
          </div>
        </div>

        {/* COMMAND BAR */}
      </div>

      <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
        {/* ESSENTIALS BLOCK */}
        <div className="mb-6 hidden sm:block">
          <h2 className="font-semibold text-[17px] text-gray-200 mb-3">
            Essentials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-4 text-[13px] ml-1">
            <div className="flex flex-col gap-1">
              <span className="text-gray-200 font-bold">Repository Owner</span>
              <span className="text-blue-300 ">@{GITHUB_CONFIG.username}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-200 font-bold">Current Path</span>
              <span className="text-blue-300 truncate">
                /{currentPath || "root"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-200 font-bold">Remote URL</span>
              <a
                href={`https://github.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-300 hover:underline truncate"
              >
                github.com/.../{GITHUB_CONFIG.repository}.git
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-200 font-bold">
                Total Items (Tree)
              </span>
              <span className="text-blue-300">{treeData.length} indexed</span>
            </div>
          </div>
        </div>

        {/* ERROR DISPLAY */}
        {error && (
          <div className="mb-6 p-4 bg-[#1e1e1e] border border-[#1e1e1e] text-white text-[13px] font-medium rounded-lg">
            Error: {error}
          </div>
        )}

        {/* CONTENT AREA */}
        <div className="bg-[#1e1e1e] border border-[#444444] shadow-sm rounded-lg overflow-hidden">
          {/* Section Header */}
          <div className="bg-[#121212] border-b border-[#444444] px-4 py-3 flex items-center justify-between text-[13px] font-semibold text-gray-100">
            <div className="flex items-center gap-2">
              {viewMode === "tree" ? (
                <Folder size={16} />
              ) : (
                <FileText size={16} />
              )}
              {viewMode === "tree" ? "Directory Listing" : "File Content"}
            </div>
            {viewMode === "blob" && (
              <button
                onClick={navigateUp}
                className="text-white hover:underline flex items-center gap-1 font-medium"
              >
                <ArrowLeft size={14} /> Back to Folder
              </button>
            )}
          </div>

          {/* FOLDER VIEW */}
          {viewMode === "tree" && (
            <div className="w-full">
              {isLoadingTree ? (
                <div className="p-8 flex items-center justify-center gap-2 text-gray-100 text-[13px]">
                  <RefreshCw size={16} className="animate-spin text-white" />
                  Fetching repository tree...
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {/* Up one level row */}
                  {currentPath !== "" && (
                    <div
                      onClick={navigateUp}
                      className="flex items-center px-4 py-2.5 hover:bg-[#1e1e1e] transition-colors gap-3 cursor-pointer group"
                    >
                      <FileSymlink size={16} className="text-white shrink-0" />
                      <span className="text-white group-hover:underline text-[13px] font-medium select-none">
                        cd /
                      </span>
                    </div>
                  )}

                  {/* Directory Items */}
                  {currentItems.map((item) => {
                    const itemName = item.path.split("/").pop() || item.path;
                    const isFolder = item.type === "tree";
                    const { lang, icon } = isFolder
                      ? {
                          lang: "Directory",
                          icon: (
                            <Folder
                              size={16}
                              className="text-white fill-[#cce3f5] shrink-0"
                            />
                          ),
                        }
                      : getFileInfo(itemName);

                    return (
                      <div
                        key={item.sha}
                        onClick={() => handleNavigate(item.path, item.type)}
                        className="flex flex-col sm:flex-row sm:items-center px-4 py-2.5 hover:bg-[#252525] transition-colors gap-2 sm:gap-4 cursor-pointer"
                      >
                        <div className="flex-1 min-w-0 flex items-center gap-3">
                          {icon}
                          <span
                            className={`truncate text-[13px] ${isFolder ? "text-white font-semibold hover:underline" : "text-gray-100 font-medium hover:underline"}`}
                          >
                            {itemName}
                          </span>
                        </div>

                        {/* Hidden on very small screens, visible on sm+ */}
                        <div className="hidden sm:flex items-center gap-6 shrink-0 text-gray-100 text-[13px] w-[200px] justify-end">
                          <span className="truncate">{lang}</span>
                          <span className="w-[60px] text-right">
                            {isFolder ? "--" : formatBytes(item.size)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* CODE/BLOB VIEW */}
          {viewMode === "blob" && (
            <div className="w-full">
              {isFileLoading ? (
                <div className="p-8 flex items-center justify-center gap-2 text-gray-500 text-[13px] bg-[#1e1e1e]">
                  <RefreshCw size={16} className="animate-spin text-white" />
                  Loading file contents...
                </div>
              ) : (
                <div className="overflow-x-auto bg-[#1e1e1e]">
                  <pre className="p-4 m-0 text-[13px] font-mono leading-relaxed text-gray-100 min-h-[400px]">
                    <code>{fileContent}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
