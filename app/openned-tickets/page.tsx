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
              className="bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-1 rounded-sm font-medium"
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
    <article className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#282A2C] rounded-3xl flex flex-col w-full overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
      {/* Card Header Container */}
      <div className="px-5 py-4 bg-gray-50 dark:bg-[#171717] border-b border-gray-100 dark:border-[#252525] flex flex-wrap items-center justify-between gap-4 transition-colors duration-300">
        {/* Identity & Meta */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-[#2d2d2d] flex items-center justify-center shrink-0">
            <User size={16} className="text-blue-700 dark:text-gray-300" />
          </div>
          <span className="text-[15px] font-bold text-gray-900 dark:text-gray-200 truncate">
            <HighlightText text={fb.name} highlight={highlightQuery} />
          </span>
          <span className="text-gray-400 dark:text-gray-600 text-[14px] hidden sm:inline">
            {"|"}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-[13px] font-medium flex items-center gap-1.5 shrink-0">
            <Clock size={14} />
            {dateStr}
          </span>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="flex items-center gap-1.5 text-[11px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full uppercase tracking-wider">
            <CheckCircle2 size={14} /> {fb.status}
          </span>
          <div className="w-px h-5 bg-gray-300 dark:bg-[#3d3d3d]"></div>
          <div className="flex items-center gap-1">
            {fb.github_id && (
              <a
                href={githubHref}
                target="_blank"
                rel="noreferrer"
                title="View GitHub Profile"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#2d2d2d] p-1.5 rounded-lg transition-colors"
              >
                <LuGithub size={18} />
              </a>
            )}
            <a
              href={mailHref}
              title="Send Email"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#2d2d2d] p-1.5 rounded-lg transition-colors"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Card Body (Markdown) */}
      <div className="p-5 md:p-6 flex flex-col relative">
        <div
          className={`relative transition-all duration-300 ease-in-out ${
            !isExpanded ? "max-h-[140px] overflow-hidden" : "max-h-[5000px]"
          }`}
        >
          <div
            ref={contentRef}
            className="prose prose-sm dark:prose-invert max-w-4xl text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed break-words
            prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-headings:font-bold 
            prose-strong:text-gray-900 dark:prose-strong:text-gray-100 
            prose-code:bg-gray-100 dark:prose-code:bg-[#202020] prose-code:text-gray-800 dark:prose-code:text-gray-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:border prose-code:border-gray-200 dark:prose-code:border-[#333] prose-code:font-mono
            prose-pre:bg-gray-50 dark:prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-[#2d2d2d] prose-pre:rounded-xl prose-pre:p-4 prose-pre:overflow-x-auto
            prose-a:text-blue-600 dark:prose-a:text-[#0078D4] hover:prose-a:underline 
            prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-[#3d3d3d] prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-[#171717] prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl"
          >
            <ReactMarkdown>{fb.feedback}</ReactMarkdown>
          </div>

          {/* Smooth Fade-out gradient when collapsed */}
          {!isExpanded && isTruncatable && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-[#121212] to-transparent pointer-events-none" />
          )}
        </div>

        {/* Read More Toggle Button */}
        {isTruncatable && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 flex items-center justify-center gap-1.5 self-start rounded-full text-[14px] font-bold text-blue-600 dark:text-[#3aa0ff] bg-blue-50 hover:bg-blue-100 dark:bg-[#252525]/50 dark:hover:bg-[#333] py-2 px-4 transition-colors focus:outline-none cursor-pointer"
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show more <ChevronDown size={16} />
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
    "w-full px-4 py-3 bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-[#282A2C] focus:border-blue-500 dark:focus:border-blue-500 text-[15px] font-medium outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-full transition-all shadow-sm dark:shadow-none";

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
    <div className="w-full min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      {/* Page Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-[#282A2C] sticky top-[72px] z-10 transition-colors duration-300">
        <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-[#121212] rounded-full flex items-center justify-center shrink-0">
                <AiOutlineIssuesClose
                  size={24}
                  className="text-blue-600 dark:text-gray-300"
                />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 h-font dark:text-gray-100 tracking-tight">
                  System Feedback
                </h1>
                <p className="text-[14px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                  Kosha Project Logs & Testimonials
                </p>
              </div>
            </div>

            {/* Command Bar */}
            <div className="relative flex items-center w-full md:w-96">
              <Search
                size={18}
                className="absolute left-4 text-gray-500 dark:text-gray-500"
              />
              <input
                type="text"
                placeholder="Search logs by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={inputClass + " pl-11"}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <FaSpinner
              className="animate-spin text-blue-600 dark:text-[#0078D4]"
              size={28}
            />
            <span className="text-[15px] font-semibold text-gray-600 dark:text-gray-400">
              Fetching telemetry data...
            </span>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center bg-white dark:bg-[#121212] border-2 border-dashed border-gray-300 dark:border-[#2d2d2d] rounded-3xl p-8">
            <Search
              size={40}
              className="text-gray-400 dark:text-gray-600 mb-4"
            />
            <h3 className="text-[18px] font-bold text-gray-900 dark:text-gray-200 mb-2">
              No Results Found
            </h3>
            <p className="text-[15px] font-medium text-gray-500 dark:text-gray-400 max-w-sm">
              We couldn&apos;t find any logs matching{" "}
              <span className="font-bold text-gray-800 dark:text-gray-300">
                &quot;{deferredQuery}&quot;
              </span>
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
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
