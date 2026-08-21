"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

// ============================================================================
// Types
// ============================================================================

interface CommitAuthor {
  name: string;
  email: string;
  date: string;
}

interface CommitData {
  message: string;
  author: CommitAuthor;
}

interface GithubCommit {
  sha: string;
  html_url: string;
  commit: CommitData;
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

// ============================================================================
// Configuration
// ============================================================================

const GITHUB_CONFIG = {
  username: "kinshukjainn",
  repository: "pvtcldstrg",
  branch: "master",
  perPage: 100,
  maxPages: 10,
};

const COMMIT_TYPES = [
  { id: "all", label: "All Types" },
  { id: "feat", label: "Features" },
  { id: "fix", label: "Bug Fixes" },
  { id: "chore", label: "Chores" },
  { id: "docs", label: "Documentation" },
  { id: "refactor", label: "Refactors" },
];

// ============================================================================
// Utility Functions
// ============================================================================

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 30) return `${days} days ago`;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getCommitTitle = (message: string) => message.split("\n")[0];

// ============================================================================
// Main Component
// ============================================================================

export default function ChangelogTracker() {
  const [commits, setCommits] = useState<GithubCommit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchingProgress, setFetchingProgress] = useState<number>(0);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);

  const fetchCommits = async () => {
    setLoading(true);
    setError(null);
    setFetchingProgress(0);

    try {
      let allCommits: GithubCommit[] = [];
      let page = 1;
      let shouldFetchMore = true;

      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      while (shouldFetchMore && page <= GITHUB_CONFIG.maxPages) {
        setFetchingProgress(page);

        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/commits?sha=${GITHUB_CONFIG.branch}&per_page=${GITHUB_CONFIG.perPage}&page=${page}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          },
        );

        if (!response.ok) {
          if (response.status === 403)
            throw new Error("GitHub API rate limit exceeded.");
          if (response.status === 404) throw new Error("Repository not found.");
          throw new Error(
            `Failed to fetch commits (Status: ${response.status})`,
          );
        }

        const data: GithubCommit[] = await response.json();

        if (data.length === 0) {
          break;
        }

        allCommits = [...allCommits, ...data];

        const oldestDateInBatch = new Date(
          data[data.length - 1].commit.author.date,
        );

        if (oldestDateInBatch < oneYearAgo) {
          shouldFetchMore = false;
        } else {
          page++;
        }
      }

      setCommits(allCommits);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommits();
  }, []);

  // --------------------------------------------------------------------------
  // Data Processing & Filtering
  // --------------------------------------------------------------------------

  const uniqueAuthors = useMemo(() => {
    return Array.from(new Set(commits.map((c) => c.commit.author.name)));
  }, [commits]);

  const displayCommits = useMemo(() => {
    return commits.filter((commit) => {
      const msg = commit.commit.message.toLowerCase();
      const authorName = commit.commit.author.name;
      const commitDate = new Date(commit.commit.author.date);
      const sha = commit.sha.toLowerCase();

      if (
        searchQuery &&
        !msg.includes(searchQuery.toLowerCase()) &&
        !sha.includes(searchQuery.toLowerCase())
      )
        return false;
      if (authorFilter !== "all" && authorName !== authorFilter) return false;
      if (
        typeFilter !== "all" &&
        !(msg.startsWith(`${typeFilter}:`) || msg.startsWith(`${typeFilter}(`))
      )
        return false;

      if (dateRange.start) {
        const startDate = new Date(dateRange.start);
        startDate.setHours(0, 0, 0, 0);
        if (commitDate < startDate) return false;
      }
      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        if (commitDate > endDate) return false;
      }
      return true;
    });
  }, [commits, searchQuery, authorFilter, typeFilter, dateRange]);

  const lastChangeDate =
    commits.length > 0
      ? new Date(commits[0].commit.author.date).toUTCString()
      : "N/A";

  const inputClass =
    "text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#444444] px-4 py-2 rounded-xl outline-none focus:border-blue-500 transition-all w-full sm:w-auto text-[14px] font-medium shadow-sm dark:shadow-none";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white text-[13px] sm:text-[14px] p-4 md:p-8 selection:bg-blue-200 dark:selection:bg-[#cce3f5] selection:text-blue-900 dark:selection:text-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* ── TOP HEADER (Breadcrumbs & Links) ── */}
        <div className="mb-2 border-b border-gray-200 h-font dark:border-gray-800 pb-4 transition-colors">
          <h1 className="text-[20px] sm:text-[24px] font-semibold m-0 p-0 text-gray-800 dark:text-gray-200">
            <Link
              href="#"
              className="text-gray-900 dark:text-white hover:underline no-underline"
            >
              Github
            </Link>{" "}
            /{" "}
            <Link
              href="#"
              className="text-gray-900 dark:text-white hover:underline no-underline"
            >
              {GITHUB_CONFIG.repository}
            </Link>{" "}
            / summary
          </h1>
        </div>

        <div className="text-[13px] sm:text-[14px] mb-6 mt-2 text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <span>summary |</span>
          <Link
            href="/git-track/tree"
            className="text-green-600 dark:text-green-500 font-semibold hover:underline no-underline"
          >
            View repo tree &rarr;
          </Link>
        </div>

        {/* ── META INFO TABLE ── */}
        <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-transparent shadow-sm dark:shadow-none rounded-2xl py-5 px-4 sm:px-6 mb-6 transition-colors duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-y-3 sm:gap-x-4 text-[13px] sm:text-[14px]">
            <div className="text-gray-500 dark:text-gray-400 font-bold">
              Description
            </div>
            <div className="text-gray-900 dark:text-gray-100 font-medium">
              {GITHUB_CONFIG.repository} git repo
            </div>

            <div className="text-gray-500 dark:text-gray-400 font-bold">
              Last change
            </div>
            <div className="text-gray-900 dark:text-gray-100 font-medium">
              {lastChangeDate}
            </div>

            <div className="text-gray-500 dark:text-gray-400 font-bold">
              URL
            </div>
            <div>
              <a
                href={`https://github.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}`}
                className="text-blue-600 dark:text-blue-300 hover:underline break-all font-medium"
              >
                https://github.com/{GITHUB_CONFIG.username}/
                {GITHUB_CONFIG.repository}.git
              </a>
            </div>

            <div className="text-gray-500 dark:text-gray-400 font-bold">
              Filters
            </div>
            <div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-blue-600 dark:text-blue-300 hover:underline cursor-pointer bg-transparent border-none p-0 font-bold"
              >
                [
                {showFilters
                  ? "hide search & filters"
                  : "show search & filters"}
                ]
              </button>
            </div>
          </div>
        </div>

        {/* ── FILTERS BLOCK ── */}
        {showFilters && (
          <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-transparent rounded-2xl p-5 mb-6 text-[13px] shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-end">
              <label className="flex flex-col gap-1.5 w-full sm:w-auto">
                <span className="text-gray-700 dark:text-gray-200 font-bold">
                  Search:
                </span>
                <input
                  type="text"
                  placeholder="search commits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${inputClass} sm:w-56`}
                />
              </label>

              <label className="flex flex-col gap-1.5 w-full sm:w-auto">
                <span className="text-gray-700 dark:text-gray-200 font-bold">
                  Author:
                </span>
                <select
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  className={inputClass}
                >
                  <option value="all">all</option>
                  {uniqueAuthors.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 w-full sm:w-auto">
                <span className="text-gray-700 dark:text-gray-200 font-bold">
                  Type:
                </span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={inputClass}
                >
                  {COMMIT_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                onClick={() => {
                  setSearchQuery("");
                  setAuthorFilter("all");
                  setTypeFilter("all");
                }}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700 text-white px-5 py-2 font-bold text-[14px] cursor-pointer rounded-full transition-all active:scale-95 w-full sm:w-auto shadow-sm"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* ── SECTION HEADER ── */}
        <h2 className="text-[22px] sm:text-[25px] text-gray-900 h-font dark:text-gray-100 font-semibold mb-4 tracking-tight">
          Commits List
        </h2>

        {/* ── ERROR & LOADING STATES ── */}
        {loading && (
          <div className="p-5 bg-blue-50 dark:bg-[#141414] border border-blue-100 dark:border-transparent text-blue-800 dark:text-gray-200 font-semibold rounded-2xl mb-4 shadow-sm dark:shadow-none">
            Fetching repository history (page {fetchingProgress})...
          </div>
        )}

        {error && (
          <div className="p-5 text-red-700 dark:text-[#a4262c] font-semibold bg-red-50 dark:bg-[#141414] border border-red-200 dark:border-transparent mb-4 rounded-2xl flex items-center justify-between shadow-sm dark:shadow-none">
            <span>FATAL ERROR: {error}</span>
            <button
              onClick={fetchCommits}
              className="text-blue-600 dark:text-[#0078D4] hover:underline bg-transparent border-none cursor-pointer font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && displayCommits.length === 0 && (
          <div className="p-8 bg-white dark:bg-[#141414] border border-gray-200 dark:border-transparent text-gray-500 dark:text-gray-400 italic rounded-2xl text-center font-medium shadow-sm dark:shadow-none">
            No commits found matching the current criteria.
          </div>
        )}

        {/* ── LIST ── */}
        {!loading && !error && displayCommits.length > 0 && (
          <div className="w-full flex flex-col bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
            {displayCommits.map((commit, index) => {
              const title = getCommitTitle(commit.commit.message);
              return (
                <div
                  key={commit.sha}
                  className="border-b border-gray-100 dark:border-gray-900 last:border-b-0 flex flex-col lg:flex-row lg:items-center py-2.5 px-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-[#141414] gap-2 lg:gap-6 transition-colors"
                >
                  {/* Time & Author */}
                  <div className="flex flex-row items-center gap-4 shrink-0 text-[13px] lg:w-[260px]">
                    <span className="text-blue-600 dark:text-blue-300 font-medium w-[85px] shrink-0">
                      {timeAgo(commit.commit.author.date)}
                    </span>
                    <span className="truncate w-[140px] text-amber-600 dark:text-yellow-500 font-bold">
                      &lt;{commit.commit.author.name}&gt;
                    </span>
                  </div>

                  {/* Message & Tag */}
                  <div className="flex-1 min-w-0 text-gray-900 dark:text-gray-100 font-medium flex items-center flex-wrap gap-2 text-[13px] sm:text-[14px]">
                    <span className="break-words">{title}</span>
                    {index === 0 && (
                      <span className="bg-amber-100 dark:bg-yellow-500 text-amber-900 dark:text-gray-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
                        master
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="shrink-0 text-[13px] mt-1 lg:mt-0 flex gap-2 lg:justify-end font-medium">
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-300 hover:underline no-underline"
                    >
                      commit
                    </a>
                    <span className="text-gray-300 dark:text-gray-700">|</span>
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-300 hover:underline no-underline"
                    >
                      commitdiff
                    </a>
                    <span className="text-gray-300 dark:text-gray-700">|</span>
                    <a
                      href={commit.html_url.replace("/commit/", "/tree/")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-300 hover:underline no-underline"
                    >
                      tree
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Indicator */}
        {!loading && !error && displayCommits.length > 0 && (
          <div className="mt-4 px-2 text-blue-600 dark:text-[#0078D4] text-[13px] font-bold cursor-pointer hover:underline inline-block">
            [ load more... ]
          </div>
        )}
      </div>
    </div>
  );
}
