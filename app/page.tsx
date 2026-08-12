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
const BG_COLOR_DARK = "#000000";

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
        <div
          className="min-h-screen"
          style={{ backgroundColor: BG_COLOR_DARK }}
        />
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
    return <div className="min-h-screen bg-white" />;
  }

  /* ─────────────────────────────────────────────────────────────
     LOGGED IN: DARK THEME CONSOLE
     ───────────────────────────────────────────────────────────── */
  if (isLoggedIn) {
    return (
      <div
        className="min-h-screen text-gray-300 selection:bg-blue-900 selection:text-white pb-20"
        style={{ backgroundColor: BG_COLOR_DARK }}
      >
        <main className="max-w-6xl mx-auto px-6 pt-24">
          <FadeIn>
            <div className="border-b border-gray-800 pb-8 mb-12">
              <h1 className="text-4xl font-semibold text-white tracking-tight mb-2">
                Console <span className="text-gray-500">|</span>{" "}
                <span>
                  <span className="bg-gradient-to-r from-[#4285F4] via-[#7B61FF] to-[#C084FC] bg-clip-text text-transparent">
                    @
                  </span>
                  {firstName}
                </span>
              </h1>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Actions */}
            <div className="md:col-span-2 space-y-6">
              <FadeIn delay={0.1}>
                <h2 className="text-xl font-semibold tracking-wider text-white mb-4">
                  Workspace Actions
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link
                    href="/dashboard"
                    className="block p-5 bg-[#202020] rounded-3xl hover:shadow-sm hover:shadow-blue-300 transition-colors"
                  >
                    <svg width="0" height="0">
                      <defs>
                        <linearGradient
                          id="googleGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#4285F4" />
                          <stop offset="35%" stopColor="#34A853" />
                          <stop offset="70%" stopColor="#FBBC05" />
                          <stop offset="100%" stopColor="#EA4335" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <FolderOpen
                      className="w-6 h-6 mb-3"
                      stroke="url(#googleGradient)"
                    />
                    <h3 className="text-white font-medium mb-1">
                      Open Dashboard
                    </h3>
                    <p className="text-md text-gray-400">
                      Manage and organize your files securely.
                    </p>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block p-5 bg-[#202020] rounded-3xl hover:shadow-sm hover:shadow-blue-300 transition-colors"
                  >
                    <Upload
                      className="w-6 h-6 mb-3"
                      stroke="url(#googleGradient)"
                    />
                    <h3 className="text-white font-medium mb-1">
                      Upload Files
                    </h3>
                    <p className="text-md text-gray-400">
                      Transfer documents to encrypted storage.
                    </p>
                  </Link>
                </div>
              </FadeIn>

              {isNewUser && (
                <FadeIn delay={0.2}>
                  <div className="mt-8 p-5 bg-blue-900/10 border border-blue-900/30 rounded-2xl">
                    <h3 className="text-md font-medium text-blue-400 mb-3 flex items-center gap-2">
                      <Check className="w-4 h-4" /> Quick Start Guide
                    </h3>
                    <ul className="space-y-3 text-md text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-gray-600">01</span> Drag and drop
                        files directly into your dashboard.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-600">02</span> Create folders
                        to maintain structural hierarchy.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-600">03</span> Your files are
                        encrypted locally before upload.
                      </li>
                    </ul>
                  </div>
                </FadeIn>
              )}
            </div>

            {/* Right Column: Status Panel */}
            <div className="space-y-6">
              <FadeIn delay={0.15}>
                <h2 className="text-xl font-semibold tracking-wider text-white mb-4">
                  Account Status
                </h2>

                <div className="p-5 border bg-[#202020] border-[#444444] rounded-3xl">
                  <div className="mb-6">
                    <p className="text-md text-gray-300 mb-1">User Profile</p>
                    <p className="text-md text-white font-medium">
                      <span className="text-blue-500">@</span>
                      {firstName}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-md text-gray-300">Storage Quota</p>
                      <p className="text-[14px] font-medium text-blue-300">
                        {storageData
                          ? `${usagePercentage.toFixed(4)}% Consumed`
                          : "FETCHING..."}
                      </p>
                    </div>

                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-2xl font-bold text-white">
                        {storageData ? formatBytes(storageData.used) : "—"}
                      </span>
                      <span className="text-md text-blue-500 font-bold mb-1">
                        / {storageData ? formatBytes(storageData.limit) : "—"}
                      </span>
                    </div>

                    <div className="w-full border-2 border-gray-500 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-blue-400 h-full transition-all duration-1000 ease-out"
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>
                  </div>

                  {storageData && (
                    <div className="flex justify-between items-center py-3 border-t border-gray-800">
                      <p className="text-md text-gray-400">
                        Total Files Stored
                      </p>
                      <p className="text-md font-medium text-white">
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
     LOGGED OUT: LIGHT THEME MARKETING UI
     ───────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-white text-gray-900  selection:bg-[#E8F0FE] selection:text-[#1A73E8]">
      <main>
        {/* Two-Column Hero Section */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              {/* Left Column: Text & Actions */}
              <FadeIn>
                <div className="max-w-xl">
                  <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-[#1F1F1F] mb-6 leading-[1.05]">
                    Store and share files securely
                  </h1>
                  <p className="text-lg sm:text-xl text-[#444746] mb-10 leading-relaxed">
                    A simple, private cloud storage solution. No bloatware, no
                    AI data harvesting, and absolute control over your digital
                    assets.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link
                      href="/verify-regis"
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-[1rem] font-medium rounded-full transition-colors flex items-center justify-center"
                    >
                      Sign up for free
                    </Link>
                    <Link
                      href="/supported-formats"
                      className="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#747775] hover:bg-gray-50 text-[#1A73E8] text-[1rem] font-medium rounded-full transition-colors flex items-center justify-center"
                    >
                      View supported formats
                    </Link>
                  </div>
                </div>
              </FadeIn>

              {/* Right Column: Lottie Animation */}
              {/* Enlarged Right Column Lottie Animation Component */}
              <FadeIn delay={0.2}>
                <div className="w-full relative flex items-center justify-center lg:h-[400px]">
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

        {/* Benefits Grid */}
        <section className="bg-[#F8F9FA] py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <FadeIn>
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-4">
                  Everything you need. <br /> Nothing you don&apos;t.
                </h2>
                <p className="text-lg text-[#444746]">
                  We stripped away the clutter to give you a cloud drive that
                  focuses entirely on keeping your files safe, private, and
                  easily accessible.
                </p>
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {MARKETING_FEATURES.map((feature, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center mb-6">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1F1F1F] mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-[#444746] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Call To Action */}
        <section className="bg-white py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <FadeIn>
              <h2 className="text-4xl font-bold text-[#1F1F1F] mb-6">
                Ready to take back control of your data?
              </h2>
              <p className="text-xl text-[#444746] mb-10 max-w-2xl mx-auto">
                Join users who have switched to a faster, safer, and completely
                private cloud storage solution. Setup takes less than a minute.
              </p>

              <div className="flex flex-col items-center justify-center space-y-6">
                <Link
                  href="/verify-regis"
                  className="px-8 py-4 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-lg font-medium rounded-full transition-colors shadow-sm"
                >
                  Create your free account
                </Link>

                <p className="flex items-center justify-center gap-6 text-sm text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-green-500" /> No credit card
                    required
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-green-500" /> 3 GB free
                    forever
                  </span>
                </p>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
    </div>
  );
}
