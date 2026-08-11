"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useDeferredValue,
} from "react";
import ReactMarkdown from "react-markdown";
import {
  Search,
  User,
  Clock,
  Mail,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
              className="bg-[#0078D4] text-white px-0.5 rounded-sm font-medium bg-opacity-80"
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

// ─── Feedback Card Component ────────────────────────────────────────────────
const FeedbackCard = ({
  fb,
  highlightQuery,
}: {
  fb: Feedback;
  highlightQuery: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncatable, setIsTruncatable] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  // Intelligently check if the content exceeds ~6 lines of text (approx 140px)
  useEffect(() => {
    // Defer the execution to avoid synchronous setState cascading renders
    const checkHeightTimer = setTimeout(() => {
      if (contentRef.current) {
        if (contentRef.current.scrollHeight > 140) {
          setIsTruncatable(true);
        } else {
          setIsTruncatable(false);
        }
      }
    }, 0);

    return () => clearTimeout(checkHeightTimer);
  }, [fb.feedback]);

  const githubHref = fb.github_id
    ? "https://github.com/" + fb.github_id.replace("@", "")
    : "";
  const mailHref = "mailto:" + fb.email;
  const dateStr = new Date(fb.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="bg-[#121212]  rounded-3xl flex flex-col w-full overflow-hidden transition-all duration-200 ">
      {/* Card Header Container */}
      <div className="px-5 py-3.5  bg-[#171717] flex flex-wrap items-center justify-between gap-4">
        {/* Identity & Meta */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#2d2d2d] border border-[#3d3d3d] flex items-center justify-center shrink-0">
            <User size={14} className="text-gray-300" />
          </div>
          <span className="text-[14px] font-semibold text-gray-200 truncate">
            <HighlightText text={fb.name} highlight={highlightQuery} />
          </span>
          <span className="text-gray-600 text-[12px] hidden sm:inline">•</span>
          <span className="text-gray-400 text-[13px] flex items-center gap-1.5 shrink-0">
            <Clock size={13} />
            {dateStr}
          </span>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <CheckCircle2 size={12} /> {fb.status}
          </span>
          <div className="w-px h-4 bg-[#3d3d3d]"></div>
          <div className="flex items-center gap-1">
            {fb.github_id && (
              <a
                href={githubHref}
                target="_blank"
                rel="noreferrer"
                title="View GitHub Profile"
                className="text-gray-400 hover:text-white hover:bg-[#2d2d2d] p-1.5 rounded-md transition-colors"
              >
                <LuGithub size={16} />
              </a>
            )}
            <a
              href={mailHref}
              title="Send Email"
              className="text-gray-400 hover:text-white hover:bg-[#2d2d2d] p-1.5 rounded-md transition-colors"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Card Body (Markdown) */}
      <div className="p-5 flex flex-col">
        <div
          className={`relative transition-all duration-300 ease-in-out ${
            !isExpanded ? "max-h-[180px] overflow-hidden" : "max-h-[5000px]"
          }`}
        >
          <div
            ref={contentRef}
            className="prose prose-sm prose-invert max-w-4xl text-gray-300 text-[14px] leading-relaxed break-words
            prose-headings:text-gray-100 prose-headings:font-semibold 
            prose-strong:text-gray-100 
            prose-code:bg-[#202020] prose-code:text-gray-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:border prose-code:border-[#333] prose-code:font-mono
            prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-[#2d2d2d] prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
            prose-a:text-[#0078D4] hover:prose-a:underline 
            prose-blockquote:border-l-4 prose-blockquote:border-[#3d3d3d] prose-blockquote:text-gray-400 prose-blockquote:bg-[#171717] prose-blockquote:py-1 prose-blockquote:px-3 prose-blockquote:rounded-r-lg"
          >
            <ReactMarkdown>{fb.feedback}</ReactMarkdown>
          </div>

          {/* Subtle fade-out gradient when collapsed */}
          {!isExpanded && isTruncatable && (
            <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" />
          )}
        </div>

        {/* Read More Toggle Button */}
        {isTruncatable && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center gap-1.5 self-start rounded-full text-[15px] font-medium text-[#0078D4] bg-[#252525]/50 backdrop-blur-lg py-1.5 hover:text-[#3aa0ff] transition-colors focus:outline-none cursor-pointer  px-3"
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp size={14} />
              </>
            ) : (
              <>
                Show more <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
};

// ─── Page ───────────────────────────────────────────────────────────────────
export default function FeedbacksList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  // useDeferredValue is a React 18 hook that provides blazing fast, non-blocking UI updates
  const deferredQuery = useDeferredValue(searchQuery);

  const inputClass =
    "w-full px-3 py-2.5 bg-[#141414]  text-[14px] outline-none text-white placeholder-gray-400 rounded-full transition-all focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4]";

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

  // Memoize the Fuse instance so it doesn't re-instantiate on every keystroke
  const fuse = useMemo(
    () =>
      new Fuse(feedbacks, {
        keys: [
          { name: "name", weight: 2 },
          { name: "feedback", weight: 1 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [feedbacks],
  );

  // Filter based on the deferred query
  const filteredFeedbacks = useMemo(() => {
    if (!deferredQuery.trim()) {
      return feedbacks;
    }
    return fuse.search(deferredQuery).map((r) => r.item);
  }, [feedbacks, deferredQuery, fuse]);

  return (
    <div className="w-full min-h-screen bg-black text-gray-100 flex flex-col ">
      {/* Page Header */}
      <header className="bg-black border-b border-[#2d2d2d] sticky top-0 z-10">
        <div className="px-4 sm:px-6 py-5 max-w-5xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-[#121212] border border-[#2d2d2d] rounded-full flex items-center justify-center shrink-0">
                <AiOutlineIssuesClose size={24} className="text-gray-300" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-100 tracking-tight">
                  System Feedback
                </h1>
                <p className="text-[13px] text-gray-400 mt-0.5">
                  Kosha Project Logs
                </p>
              </div>
            </div>

            {/* Command Bar */}
            <div className="relative flex items-center w-full md:w-80">
              <Search size={15} className="absolute left-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search logs by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={inputClass + " pl-9"}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <FaSpinner className="animate-spin text-[#0078D4]" size={22} />
            <span className="text-[14px] font-medium text-gray-400">
              Fetching telemetry data...
            </span>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center border border-dashed border-[#2d2d2d] rounded-xl bg-[#0a0a0a]">
            <Search size={32} className="text-gray-600 mb-3" />
            <h3 className="text-[15px] font-semibold text-gray-300 mb-1">
              No Results Found
            </h3>
            <p className="text-[13px] text-gray-500 max-w-sm">
              We couldn&apos;t find any logs matching &quot;{deferredQuery}
              &quot;.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {filteredFeedbacks.map((fb) => (
              <FeedbackCard
                key={fb.id}
                fb={fb}
                highlightQuery={deferredQuery}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
