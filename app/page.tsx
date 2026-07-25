"use client";

import React, { Suspense, useEffect, useState } from "react";
import {
  ShieldCheck,
  Zap,
  Layout,
  ArrowRight,
  BrainCircuit,
  LockKeyhole,
  HardDrive,
  Check,
  FolderOpen,
  Upload,
  BrickWallShield,
  FileCog,
  Cog,
  Server,
} from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

// IMPORT YOUR SERVER ACTION HERE
// Adjust the path "@/_actions/fileActions" to wherever you saved the server action file
import { getStorageInfo } from "@/actions/drive";

/* ── Constants & Utilities ── */
const BG_COLOR = "#161923";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const FEATURES = [
  {
    id: "01",
    title: "20 GB Free Forever",
    body: "Generous AWS backed storage for everyone. Drop your files without worrying about space.",
    icon: HardDrive,
    category: "Infrastructure",
  },
  {
    id: "02",
    title: "Absolute Privacy",
    body: "Amazon S3 Encryption. We can't see your files or sell your habits.",
    icon: ShieldCheck,
    category: "Security",
  },
  {
    id: "03",
    title: "Zero Bloat",
    body: "No unnecessary features. A clean interface designed to get out of your way.",
    icon: Layout,
    category: "Experience",
  },
  {
    id: "04",
    title: "Lightning Fast",
    body: "Optimized for speed. Uploads and downloads in the blink of an eye.",
    icon: Zap,
    category: "Infrastructure",
  },
  {
    id: "05",
    title: "No AI Training",
    body: "We do not use your data to train AI models. Your files are yours alone.",
    icon: BrainCircuit,
    category: "Security",
  },
  {
    id: "06",
    title: "No Bloated AI",
    body: "We do not offer any AI features. We focus on secure, private storage without distractions.",
    icon: BrickWallShield,
    category: "Experience",
  },
  {
    id: "07",
    title: "Multiple Formats",
    body: "We support a wide range of file formats including documents, images, videos, and more.",
    icon: FileCog,
    category: "Infrastructure",
  },
  {
    id: "08",
    title: "You Control Your Data",
    body: "We do not collect any data about your files or usage. Full control over what you share.",
    icon: Cog,
    category: "Security",
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
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.4, ease: "easeOut", delay }}
  >
    {children}
  </motion.div>
);

/* ── Page Entry ── */
export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen" style={{ backgroundColor: BG_COLOR }} />
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

  return (
    <div
      className="min-h-screen text-gray-300 rounded-2xl selection:bg-blue-900 selection:text-white"
      style={{ backgroundColor: BG_COLOR }}
    >
      {/* ── LOGGED IN: CONSOLE VIEW ── */}
      {isLoggedIn ? (
        <main className="max-w-6xl mx-auto px-6 pt-24 pb-20">
          <FadeIn>
            <div className="border-b border-gray-800 pb-8 mb-12">
              <h1 className="text-4xl font-semibold text-white tracking-tight mb-2">
                Console <span className="text-gray-500">|</span>{" "}
                <span>
                  <span className="text-green-500">@</span>
                  {firstName}
                </span>
              </h1>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Actions */}
            <div className="md:col-span-2 space-y-6">
              <FadeIn delay={0.1}>
                <h2 className="text-md font-bold uppercase tracking-wider text-green-500 mb-4">
                  Workspace Actions
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link
                    href="/dashboard"
                    className="block p-5 border-2 hover:border-green-500 border-[#444444] rounded-3xl hover:bg-green-800/20 transition-colors"
                  >
                    <FolderOpen className="w-6 h-6 text-green-500 mb-3" />
                    <h3 className="text-white font-medium mb-1">
                      Open Dashboard
                    </h3>
                    <p className="text-md text-gray-400">
                      Manage and organize your files securely.
                    </p>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block p-5 border-2 hover:border-green-500 border-[#444444]  rounded-3xl hover:bg-green-800/20 transition-colors"
                  >
                    <Upload className="w-6 h-6 text-green-500 mb-3" />
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
                <h2 className="text-md font-bold uppercase tracking-wider text-green-500 mb-4">
                  Account Status
                </h2>

                <div className="p-5 border-2 hover:border-green-500  border-[#444444] rounded-3xl ">
                  <div className="mb-6">
                    <p className="text-md text-gray-400 mb-1">User Profile</p>
                    <p className="text-md text-white font-medium">
                      <span className="text-green-500">{"@"}</span>
                      {firstName}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-md text-gray-400">Storage Quota</p>
                      <p className="text-[14px] font-medium text-[#ff9100] ">
                        {storageData
                          ? `${usagePercentage.toFixed(4)}% Consumed`
                          : "FETCHING..."}
                      </p>
                    </div>

                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-2xl font-normal text-white">
                        {storageData ? formatBytes(storageData.used) : "—"}
                      </span>
                      <span className="text-md text-green-500 font-bold  mb-1">
                        / {storageData ? formatBytes(storageData.limit) : "—"}
                      </span>
                    </div>

                    {/* AWS-style Progress Bar */}
                    <div className="w-full border-2 border-green-500 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-green-500 h-full transition-all duration-1000 ease-out"
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
      ) : (
        /* ── LOGGED OUT: MARKETING / PRODUCT PAGE ── */
        <main>
          {/* Trust Banner */}
          <div className=" border-2 rounded-full bg-gray-800/20 backdrop-blur-xs border-[#444444] mr-2 ml-2 mt-3">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4 text-md font-medium text-gray-400">
              <span className="flex items-center gap-1.5">
                <LockKeyhole className="w-3.5 h-3.5" /> End-to-End Encrypted
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" /> AWS Infrastructure
              </span>
            </div>
          </div>

          {/* Hero Section */}
          <section className="max-w-6xl mx-auto px-6 pt-24 pb-16">
            <FadeIn>
              <h1 className="text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6 max-w-3xl leading-tight">
                Secure cloud storage. <br />
                <span className="text-green-500 font-bold">
                  Without the complexity.
                </span>
              </h1>
              <p className="text-lg text-gray-200 mb-10 max-w-2xl leading-relaxed">
                A simple, open-source, private cloud storage solution. No
                bloatware, no AI data harvesting, and absolute control over your
                digital assets.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="/verify-regis"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-md font-medium rounded-2xl transition-colors flex items-center gap-2"
                >
                  Create free account <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/supported-formats"
                  className="px-6 py-3 bg-transparent border border-gray-600 hover:border-gray-400 text-white text-md font-medium rounded-2xl transition-colors"
                >
                  View supported formats
                </Link>
              </div>
            </FadeIn>
          </section>

          {/* Video Preview */}
          {isLoaded && !userId && (
            <section className="max-w-6xl mx-auto px-6 py-12">
              <FadeIn delay={0.1}>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold uppercase tracking-wider text-green-500">
                    Interface Preview
                  </h2>
                </div>
                <div className="rounded-2xl border border-gray-700 bg-[#1a1d27] shadow-2xl overflow-hidden">
                  <div className="flex items-center px-4 py-2 border-b border-gray-700 bg-[#161923]">
                    <div className="text-md font-mono text-gray-500">
                      kosha.cloudkinshuk.in/dashboard
                    </div>
                  </div>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-auto block aspect-video object-cover"
                  >
                    <source src="/videos/brandy.mp4" type="video/mp4" />
                  </video>
                </div>
              </FadeIn>
            </section>
          )}

          {/* Features */}
          <section className="max-w-6xl mx-auto px-6 py-24 border-t border-gray-800">
            <FadeIn>
              <div className="mb-16">
                <h2 className="text-2xl font-normal text-green-500 mb-2">
                  Technical Specifications
                </h2>
                <p className="text-gray-400">
                  Built for performance, privacy, and simplicity.
                </p>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-12">
              {["Infrastructure", "Security", "Experience"].map(
                (category, idx) => (
                  <div key={category}>
                    <FadeIn delay={idx * 0.1}>
                      <h3 className="text-md font-semibold uppercase tracking-wider text-green-500 border-b border-gray-800 pb-3 mb-6">
                        {category}
                      </h3>
                      <div className="space-y-8">
                        {FEATURES.filter((f) => f.category === category).map(
                          (f) => (
                            <div key={f.id} className="group">
                              <div className="flex items-center gap-3 mb-2">
                                <f.icon className="w-4 h-4 text-white" />
                                <h4 className="text-white font-medium">
                                  {f.title}
                                </h4>
                              </div>
                              <p className="text-md text-gray-300 leading-relaxed pl-7">
                                {f.body}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </FadeIn>
                  </div>
                ),
              )}
            </div>
          </section>

          {/* Footer CTA */}
          <section className="border-t border-gray-800 bg-[#1a1d27]">
            <div className="max-w-6xl mx-auto px-6 py-20">
              <FadeIn>
                <div className="max-w-2xl">
                  <h2 className="text-4xl font-bold text-green-500 mb-4">
                    Start using Kosha today.
                  </h2>
                  <p className="text-gray-200 mb-8">
                    Get permanent, encrypted cloud storage at zero cost. No
                    credit card required. No hidden tracking.
                  </p>
                  <ul className="space-y-3 text-md text-white mb-8">
                    {[
                      "Unlimited file types",
                      "Private by default",
                      "Fast downloads anywhere",
                      "No AI training policies",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" /> {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/verify-regis"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white text-lg font-medium rounded-2xl hover:bg-green-600 transition-colors"
                  >
                    Deploy your workspace
                  </Link>
                </div>
              </FadeIn>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
