"use client";

import React from "react";
import Link from "next/link";
import { Scale, ShieldAlert, Mail, Globe, ChevronRight } from "lucide-react";

const PLATFORM_NAME = "Kosha";
const PLATFORM_URL = "https://kosha.cloudkinshuk.in";
const SUPPORT_EMAIL = "kinshuk25jan04@gmail.com";
const EFFECTIVE_DATE = "April 15, 2026";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-200  selection:bg-[#0078D4] selection:text-white relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0078D4] opacity-[0.03] blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 lg:py-24 relative z-10">
        {/* Header Section */}
        <div className="mb-16 pb-10 border-b border-[#222]">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0078D4]/10 border border-[#0078D4]/20 text-[#0078D4] text-xs font-bold tracking-widest uppercase">
              <Scale className="w-3.5 h-3.5" />
              Legal Documentation
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Terms of Service
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-[15px] text-gray-400">
            <p>
              Effective Date:{" "}
              <span className="text-gray-200 font-medium">
                {EFFECTIVE_DATE}
              </span>
            </p>
            <span className="hidden sm:inline-block text-[#333]">•</span>
            <p>
              Platform:{" "}
              <span className="text-gray-200 font-medium">{PLATFORM_NAME}</span>
            </p>
          </div>
        </div>

        {/* Body Content */}
        <div className="space-y-16 text-[15px] md:text-[16px] leading-relaxed text-gray-300">
          {/* Introduction */}
          <section className="prose prose-invert max-w-none">
            <p className="text-lg text-gray-400">
              These Terms of Service (&quot;Terms&quot;) govern your access to
              and use of the {PLATFORM_NAME} platform available at{" "}
              <a
                href={PLATFORM_URL}
                className="text-[#0078D4] hover:text-[#3399ff] hover:underline underline-offset-4 transition-colors font-medium break-all"
              >
                {PLATFORM_URL}
              </a>
              . By accessing or using the Service, you agree to be bound by
              these Terms and all applicable laws and regulations.
            </p>
          </section>

          {/* Section 1: Description of Service */}
          <section>
            <SectionHeading number="01" title="Description of Service" />
            <p className="mb-5">
              {PLATFORM_NAME} is a high-performance cloud-based file storage
              platform designed to allow users to securely upload, store, and
              manage files. The service includes, but is not limited to:
            </p>
            <BulletList
              items={[
                "Secure file uploads and downloads utilizing encrypted presigned URLs.",
                "Per-account storage allocation and bandwidth limits based on your subscription.",
                "Robust authentication and user management powered by Clerk.",
                "Access to optional paid plans for expanded storage and premium features.",
              ]}
            />
          </section>

          {/* Expand your sections here as needed... */}

          {/* Section 10: Limitation of Liability (Premium Highlight Card) */}
          <section>
            <SectionHeading number="10" title="Limitation of Liability" />

            <div className="relative mt-6 border border-[#333] bg-[#0a0a0c] rounded-2xl p-6 md:p-8 overflow-hidden group hover:border-[#444] transition-colors">
              {/* Card internal gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] pointer-events-none" />

              <div className="relative z-10 flex items-start gap-4 mb-5">
                <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    Maximum Extent Permitted by Law
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Please read this section carefully as it limits our
                    liability.
                  </p>
                </div>
              </div>

              <div className="relative z-10 pl-0 md:pl-14">
                <BulletList
                  items={[
                    "No liability for indirect, incidental, special, consequential, or punitive damages.",
                    "No liability for loss of profits, data loss, use, goodwill, or other intangible losses.",
                    "No liability for service interruptions or unauthorized access to your data.",
                    "Maximum aggregate liability for all claims relating to the service shall not exceed the amounts paid by you to Kosha in the past 12 months, or ₹500, whichever is greater.",
                  ]}
                />
                <div className="mt-6 p-4 bg-[#111] border border-[#222] rounded-xl text-[14px] text-gray-400 italic">
                  The Service is provided on an &quot;as is&quot; and &quot;as
                  available&quot; basis without warranties of any kind, whether
                  express or implied.
                </div>
              </div>
            </div>
          </section>

          {/* Section 16: Contact Information */}
          <section>
            <SectionHeading number="16" title="Contact Us" />
            <p className="mb-6">
              If you have any questions, concerns, or requests regarding these
              Terms, please reach out to us using the official channels below.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Card */}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex flex-col p-6 rounded-2xl bg-[#0a0a0c] border border-[#222] hover:border-[#0078D4]/50 hover:bg-[#111] transition-all group"
              >
                <Mail className="w-6 h-6 text-gray-400 group-hover:text-[#0078D4] transition-colors mb-4" />
                <span className="text-sm text-gray-500 font-medium mb-1">
                  Email Support
                </span>
                <span className="text-gray-200 font-medium group-hover:text-white transition-colors break-all">
                  {SUPPORT_EMAIL}
                </span>
              </a>

              {/* Website Card */}
              <a
                href={PLATFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col p-6 rounded-2xl bg-[#0a0a0c] border border-[#222] hover:border-[#0078D4]/50 hover:bg-[#111] transition-all group"
              >
                <Globe className="w-6 h-6 text-gray-400 group-hover:text-[#0078D4] transition-colors mb-4" />
                <span className="text-sm text-gray-500 font-medium mb-1">
                  Official Platform
                </span>
                <span className="text-gray-200 font-medium group-hover:text-white transition-colors break-all">
                  {PLATFORM_URL.replace("https://", "")}
                </span>
              </a>
            </div>
          </section>
        </div>

        {/* Footer Navigation Back */}
        <div className="mt-20 pt-8 border-t border-[#222] flex justify-center">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
          >
            Return to Kosha Login
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   UTILITY COMPONENTS
   ========================================= */

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="text-2xl font-bold text-white mb-6 flex items-baseline gap-4 group">
      <span className="text-[#0078D4] font-mono text-xl opacity-80 group-hover:opacity-100 transition-opacity">
        {number}.
      </span>
      {title}
    </h2>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3.5 text-gray-300">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="text-[#0078D4] mt-1.5 flex-shrink-0">
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="8" height="8" rx="2" fill="currentColor" />
            </svg>
          </span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
