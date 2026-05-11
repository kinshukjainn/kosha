"use client";

import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Search, User, Clock, Mail, CheckCircle2 } from "lucide-react";
import Fuse from "fuse.js";
import { getFeedbacksAction } from "../actions";
import { LuGithub } from "react-icons/lu";
import { FaSpinner } from "react-icons/fa";
import { AiOutlineIssuesClose } from "react-icons/ai";
// ─── Types ──────────────────────────────────────────────────────────────────
type Feedback = {
  id: string;
  created_at: string;
  category: "Blogs" | "Projects" | "Portfolio Website";
  project_name: "Kosha" | "MScada" | null;
  name: string;
  github_id: string | null;
  email: string;
  feedback: string;
  status: "pending" | "approved" | "rejected";
  reviewed_at: string | null;
};

// ─── Highlight helper ───────────────────────────────────────────────────────
function HighlightText(props: { text: string; highlight: string }) {
  const { text, highlight } = props;
  if (!highlight.trim() || !text) {
    return <>{text}</>;
  }
  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp("(" + escaped + ")", "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        if (regex.test(part)) {
          return (
            <mark
              key={i}
              className="bg-[#fff100] text-black px-0.5 rounded-xl font-semibold"
            >
              {part}
            </mark>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function FeedbacksList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const inputClass =
    "w-full px-3 py-3 bg-[#252525] border border-[#3d3d3d] text-[17px] outline-none text-gray-100 placeholder-gray-500  rounded-full transition-all";

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const result = await getFeedbacksAction();
        if (!result.success) {
          throw new Error(result.error || "Failed to fetch feedbacks");
        }
        const raw = (result.data as Feedback[]) || [];
        // Defensive client guard — even if the action returns extras, only
        // Kosha + approved can reach the screen.
        const safe = raw.filter(function (fb) {
          return fb.project_name === "Kosha" && fb.status === "approved";
        });
        if (!cancelled) setFeedbacks(safe);
      } catch (error) {
        if (!cancelled) console.error("Error fetching feedbacks:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredFeedbacks = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return feedbacks;
    }
    const fuse = new Fuse(feedbacks, {
      keys: [
        { name: "name", weight: 2 },
        { name: "feedback", weight: 1 },
      ],
      threshold: 0.3,
      ignoreLocation: true,
    });
    return fuse.search(debouncedQuery).map((r) => r.item);
  }, [feedbacks, debouncedQuery]);

  return (
    <div className="w-full min-h-screen bg-black text-gray-100">
      {/* Page Header */}
      <div className="bg-black border-b border-[#2d2d2d]">
        <div className="px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <div
              className="w-13 h-13
             bg-[#0078D4] rounded-full flex items-center justify-center shrink-0"
            >
              <AiOutlineIssuesClose size={30} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold text-white tracking-tight leading-tight">
                Kosha Logs & Issues
              </h1>
              <p className="text-[17px] text-gray-200 mt-0.5  tracking-wide">
                System Feedback — Strictly Kosha Project
              </p>
            </div>
          </div>
        </div>

        {/* Command Bar — search only, NO category filter tabs */}
        <div className="bg-black px-6 py-3 ">
          <div className="max-w-7xl mx-auto w-full">
            <div className="relative flex items-center w-full md:w-96">
              <Search size={14} className="absolute left-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search logs by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={inputClass + " pl-8"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="bg-[#1e1e1e] border border-[#2d2d2d] shadow-sm flex flex-col items-center justify-center min-h-[40vh] gap-3 p-8 rounded-xl">
            <FaSpinner className="animate-spin text-[#0078D4]" size={24} />
            <span className="text-[13px] font-semibold text-gray-400">
              Fetching telemetry data...
            </span>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="bg-[#1e1e1e] border border-[#2d2d2d] shadow-sm flex flex-col items-center justify-center min-h-[40vh] p-8 text-center rounded-xl">
            <Search size={40} className="text-gray-600 mb-4" />
            <h3 className="text-[16px] font-semibold text-white mb-1">
              No Results Found
            </h3>
            <p className="text-[13px] text-gray-500 max-w-sm">
              No logs matching your search in the Kosha project.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFeedbacks.map((fb) => {
              const githubHref = fb.github_id
                ? "https://github.com/" + fb.github_id.replace("@", "")
                : "";
              const mailHref = "mailto:" + fb.email;
              const dateStr = new Date(fb.created_at).toLocaleDateString(
                undefined,
                { year: "numeric", month: "short", day: "numeric" },
              );

              return (
                <article
                  key={fb.id}
                  className="bg-[#1e1e1e] border border-[#2d2d2d] p-5 rounded-xl shadow-sm hover:border-[#3d3d3d] transition-colors flex flex-col"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#2d2d2d]">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-[#0078D4] uppercase">
                        KOSHA
                      </span>
                      <span className="ml-2 flex items-center gap-1 text-[11px] font-semibold text-green-400 bg-green-950/40 px-1.5 py-0.5 rounded-xl border border-green-900 uppercase">
                        <CheckCircle2 size={12} /> {fb.status}
                      </span>
                    </div>
                    <span className="text-gray-500 text-[12px] flex items-center gap-1.5 font-medium">
                      <Clock size={12} className="text-gray-600" />
                      {dateStr}
                    </span>
                  </div>

                  {/* Markdown */}
                  <div className="prose prose-sm prose-invert max-w-none mb-6 flex-grow text-gray-200 text-[13px] prose-p:leading-relaxed prose-p:text-gray-200 prose-headings:text-white prose-headings:font-semibold prose-strong:text-white prose-code:bg-[#2d2d2d] prose-code:text-[#ff8a93] prose-code:px-1 prose-code:py-0.5 prose-code:rounded-xl prose-pre:bg-[#252525] prose-pre:border prose-pre:border-[#3d3d3d] prose-pre:rounded-xl prose-pre:p-3 prose-a:text-[#0078D4] hover:prose-a:underline prose-blockquote:border-l-[#3d3d3d] prose-blockquote:text-gray-400">
                    <ReactMarkdown>{fb.feedback}</ReactMarkdown>
                  </div>

                  {/* Footer */}
                  <footer className="pt-3 border-t border-[#2d2d2d] flex flex-wrap items-center justify-between mt-auto gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-[#2d2d2d] flex items-center justify-center text-gray-400 shrink-0">
                        <User size={14} />
                      </div>
                      <span className="text-[13px] font-medium text-gray-100">
                        <HighlightText
                          text={fb.name}
                          highlight={debouncedQuery}
                        />
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {fb.github_id ? (
                        <a
                          href={githubHref}
                          target="_blank"
                          rel="noreferrer"
                          title="View GitHub Profile"
                          className="text-gray-400 hover:text-[#0078D4] hover:bg-[#2a2a2a] p-1.5 rounded-xl transition-colors"
                        >
                          <LuGithub size={16} />
                        </a>
                      ) : null}
                      <a
                        href={mailHref}
                        title="Send Email"
                        className="text-gray-400 hover:text-[#0078D4] hover:bg-[#2a2a2a] p-1.5 rounded-xl transition-colors"
                      >
                        <Mail size={16} />
                      </a>
                    </div>
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
