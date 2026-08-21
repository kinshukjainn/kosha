"use client";

import React, { Suspense, useEffect, useState } from "react";
import {
  ShieldCheck,
  Zap,
  Layout,
  BrainCircuit,
  HardDrive,
  Check,
  FolderOpen,
  Upload,
  FileCog,
} from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// IMPORT YOUR SERVER ACTION HERE
import { getStorageInfo } from "@/actions/drive";

/* ── Constants & Utilities ── */
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Simplified, benefit-driven features for the Light Theme Marketing Page
const MARKETING_FEATURES = [
  {
    title: "3 GB of free space",
    description:
      "Plenty of room for thousands of documents, photos, and projects. Start storing for free, forever.",
    icon: HardDrive,
  },
  {
    title: "Your privacy is guaranteed",
    description:
      "Backed by enterprise-grade encryption. Your files are yours alone—we never read, scan, or sell your data.",
    icon: ShieldCheck,
  },
  {
    title: "Zero AI data mining",
    description:
      "Unlike other tech giants, we strictly prohibit using your personal or professional files to train AI models.",
    icon: BrainCircuit,
  },
  {
    title: "Blazing fast access",
    description:
      "Optimized cloud infrastructure means your files upload and download instantly, from any device.",
    icon: Zap,
  },
  {
    title: "Beautifully simple",
    description:
      "No cluttered menus or unnecessary bloatware. A clean workspace designed to help you focus.",
    icon: Layout,
  },
  {
    title: "Works with everything",
    description:
      "Preview PDFs, images, spreadsheets, and media files directly in your browser without downloading.",
    icon: FileCog,
  },
];

/* ── Minimal Animation Component ── */
const FadeIn = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, ease: "easeOut", delay }}
  >
    {children}
  </motion.div>
);

/* ── Page Entry ── */
export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors" />
      }
    >
      <MainContent />
    </Suspense>
  );
}

function MainContent() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const searchParams = useSearchParams();

  const isLoggedIn = isLoaded && !!userId;
  const isNewUser = searchParams.get("new") === "true";
  const firstName = user?.firstName || "User";

  // State to hold dynamic storage info
  const [storageData, setStorageData] = useState<{
    used: number;
    limit: number;
    currentFileCount: number;
    maxFileSize: number;
  } | null>(null);

  // Fetch storage info on mount if user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      getStorageInfo()
        .then((data) => setStorageData(data))
        .catch((err) => console.error("Failed to fetch storage info:", err));
    }
  }, [isLoggedIn]);

  // Calculate percentages for the UI
  const usagePercentage = storageData?.limit
    ? Math.min(100, (storageData.used / storageData.limit) * 100)
    : 0;

  // Wait for Clerk to load to prevent UI flashing
  if (!isLoaded) {
    return <div className="min-h-screen bg-slate-50 dark:bg-black" />;
  }

  /* ─────────────────────────────────────────────────────────────
     LOGGED IN: DASHBOARD CONSOLE
     ───────────────────────────────────────────────────────────── */
  if (isLoggedIn) {
    return (
      <div className="min-h-screen selection:bg-blue-200 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-white bg-slate-50 dark:bg-[#0a0a0a] pb-20 transition-colors duration-300">
        <main className="max-w-6xl mx-auto px-6 pt-24 lg:pt-32">
          <FadeIn>
            <div className="border-b border-slate-200 dark:border-white/10 pb-8 mb-12">
              <h1 className="text-4xl font-semibold text-slate-900 dark:text-white h-font tracking-tight mb-2 flex items-center gap-3">
                Console{" "}
                <span className="text-slate-300 dark:text-gray-700 font-light">
                  |
                </span>{" "}
                <span className="flex items-center">
                  <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent mr-0.5">
                    @
                  </span>
                  {firstName}
                </span>
              </h1>
              <p className="text-slate-500 dark:text-gray-400 text-lg">
                Welcome back to your secure workspace.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Actions */}
            <div className="md:col-span-2 space-y-6">
              <FadeIn delay={0.1}>
                <h2 className="text-2xl font-semibold h-font tracking-wide text-slate-900 dark:text-white mb-4 uppercase text-[17px]">
                  Workspace Actions
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Link
                    href="/dashboard"
                    className="group block p-6 bg-white dark:bg-[#202020] border border-slate-200 dark:border-white/5 rounded-3xl hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 ease-out"
                  >
                    {/* SVG Gradient Definition */}
                    <svg width="0" height="0">
                      <defs>
                        <linearGradient
                          id="googleGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#2563EB" />
                          <stop offset="50%" stopColor="#6366F1" />
                          <stop offset="100%" stopColor="#A855F7" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                      <FolderOpen
                        className="w-6 h-6"
                        stroke="url(#googleGradient)"
                      />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-1">
                      Open Dashboard
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                      Manage, organize, and access your encrypted files
                      securely.
                    </p>
                  </Link>

                  <Link
                    href="/dashboard"
                    className="group block p-6 bg-white dark:bg-[#202020] border border-slate-200 dark:border-white/5 rounded-3xl hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300 ease-out"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                      <Upload
                        className="w-6 h-6"
                        stroke="url(#googleGradient)"
                      />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-1">
                      Upload Files
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                      Transfer documents into your private, end-to-end encrypted
                      storage.
                    </p>
                  </Link>
                </div>
              </FadeIn>

              {isNewUser && (
                <FadeIn delay={0.2}>
                  <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl">
                    <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                      <div className="bg-blue-200 dark:bg-blue-500/20 p-1 rounded-full">
                        <Check className="w-3 h-3" />
                      </div>
                      Quick Start Guide
                    </h3>
                    <ul className="space-y-4 text-sm text-slate-600 dark:text-gray-300">
                      <li className="flex items-start gap-3">
                        <span className="font-mono text-xs font-semibold text-blue-400 dark:text-blue-500 bg-white dark:bg-black px-1.5 py-0.5 rounded border border-blue-100 dark:border-white/10 mt-0.5">
                          01
                        </span>
                        Drag and drop files directly into your dashboard to
                        begin uploading.
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="font-mono text-xs font-semibold text-blue-400 dark:text-blue-500 bg-white dark:bg-black px-1.5 py-0.5 rounded border border-blue-100 dark:border-white/10 mt-0.5">
                          02
                        </span>
                        Create nested folders to maintain a clean structural
                        hierarchy.
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="font-mono text-xs font-semibold text-blue-400 dark:text-blue-500 bg-white dark:bg-black px-1.5 py-0.5 rounded border border-blue-100 dark:border-white/10 mt-0.5">
                          03
                        </span>
                        Rest easy knowing your files are encrypted before they
                        ever leave your device.
                      </li>
                    </ul>
                  </div>
                </FadeIn>
              )}
            </div>

            {/* Right Column: Status Panel */}
            <div className="space-y-6">
              <FadeIn delay={0.15}>
                <h2 className="text-lg font-semibold h-font tracking-wide text-slate-900 dark:text-white mb-4 uppercase text-[13px]">
                  Account Status
                </h2>

                <div className="p-6 bg-white dark:bg-[#202020] border border-slate-200 dark:border-white/5 shadow-sm rounded-3xl">
                  <div className="mb-8">
                    <p className="text-[13px] uppercase tracking-wide text-slate-500 dark:text-gray-500 mb-1.5 font-medium">
                      User Profile
                    </p>
                    <p className="text-base text-slate-900 dark:text-white font-medium flex items-center">
                      <span className="text-blue-500 mr-0.5">@</span>
                      {firstName}
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className="flex justify-between items-end mb-3">
                      <p className="text-[13px] uppercase tracking-wide text-slate-500 dark:text-gray-500 font-medium">
                        Storage Quota
                      </p>
                      <p className="text-[13px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full">
                        {storageData
                          ? `${usagePercentage.toFixed(2)}% Used`
                          : "Fetching..."}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {storageData ? formatBytes(storageData.used) : "—"}
                      </span>
                      <span className="text-sm text-slate-400 dark:text-gray-500 font-medium">
                        / {storageData ? formatBytes(storageData.limit) : "—"}
                      </span>
                    </div>

                    {/* Modern Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>
                  </div>

                  {storageData && (
                    <div className="flex justify-between items-center pt-5 border-t border-slate-100 dark:border-white/10">
                      <p className="text-[13px] uppercase tracking-wide text-slate-500 dark:text-gray-500 font-medium">
                        Total Files
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-white/5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/5">
                        {storageData.currentFileCount}
                      </p>
                    </div>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     LOGGED OUT: MARKETING UI
     ───────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-gray-100 selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900/50 transition-colors duration-300">
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-slate-100 dark:border-white/5">
          {/* Subtle Background Glow for Light Mode */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white dark:hidden -z-10" />

          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              {/* Left Column: Text & Actions */}
              <FadeIn>
                <div className="max-w-xl relative z-10">
                  <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-semibold h-font tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.05]">
                    Store and share <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                      files securely
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl text-slate-600 dark:text-neutral-400 mb-10 leading-relaxed font-medium">
                    A simple, private cloud storage solution. No bloatware, no
                    AI data harvesting, and absolute control over your digital
                    assets.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link
                      href="/trials"
                      className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-slate-900 text-[1rem] font-semibold rounded-full transition-all duration-200 flex items-center justify-center shadow-lg shadow-slate-900/10 dark:shadow-white/10 hover:scale-[1.02]"
                    >
                      Try in sandbox for free
                    </Link>
                    <Link
                      href="/supported-formats"
                      className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-white text-[1rem] font-semibold rounded-full transition-all duration-200 flex items-center justify-center hover:scale-[1.02]"
                    >
                      View supported formats
                    </Link>
                  </div>
                </div>
              </FadeIn>

              {/* Right Column: Lottie Animation */}
              <FadeIn delay={0.2}>
                <div className="w-full relative flex items-center justify-center lg:h-[400px]">
                  {/* Subtle backdrop circle behind animation in light mode */}
                  <div className="absolute inset-0 bg-blue-50/50 dark:bg-transparent rounded-full blur-3xl scale-75 -z-10" />
                  <DotLottieReact
                    src="https://lottie.host/b48fbcb5-6f01-447c-8156-b46ef6b0b9ea/WVSuhZ4lah.lottie"
                    loop
                    autoplay
                    className="w-full max-w-[800px] lg:scale-125 object-contain"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Benefits Grid Section */}
        <section className="bg-slate-50 dark:bg-black py-24 border-b border-slate-100 dark:border-white/5">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <FadeIn>
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl h-font font-semibold text-slate-900 dark:text-white mb-5 tracking-tight">
                  Everything you need. <br className="hidden sm:block" />
                  Nothing you don&apos;t.
                </h2>
                <p className="text-lg text-slate-600 dark:text-neutral-400">
                  We stripped away the clutter to give you a cloud drive that
                  focuses entirely on keeping your files safe, private, and
                  easily accessible.
                </p>
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {MARKETING_FEATURES.map((feature, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div className="bg-white dark:bg-[#111111] p-8 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-sm hover:shadow-md dark:shadow-none transition-shadow h-full flex flex-col">
                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-800 flex items-center justify-center mb-6 ">
                      <feature.icon className="w-6 h-6 text-blue-600 dark:text-white" />
                    </div>
                    <h3 className="text-lg font-semibold h-font text-slate-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-neutral-400 leading-relaxed text-[15px]">
                      {feature.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Call To Action */}
        <section className="bg-white dark:bg-[#0a0a0a] py-24 relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-3/4 h-1/2 bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <FadeIn>
              <h2 className="text-4xl sm:text-5xl font-semibold h-font tracking-tight text-slate-900 dark:text-white mb-6">
                Ready to take back control?
              </h2>
              <p className="text-xl text-slate-600 dark:text-neutral-400 mb-10 max-w-2xl mx-auto font-medium">
                Join users who have switched to a faster, safer, and completely
                private cloud storage solution. Setup takes less than a minute.
              </p>

              <div className="flex flex-col items-center justify-center space-y-8">
                <Link
                  href="/verify-regis"
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-lg font-semibold rounded-full transition-all shadow-xl shadow-blue-600/20 hover:scale-[1.02]"
                >
                  Create your free account
                </Link>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-slate-500 dark:text-gray-400 font-medium bg-slate-50 dark:bg-white/5 px-6 py-3 rounded-full border border-slate-200 dark:border-white/5">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> No credit card
                    required
                  </span>
                  <span className="hidden sm:inline text-slate-300 dark:text-gray-600">
                    |
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> 3 GB free
                    forever
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
    </div>
  );
}
