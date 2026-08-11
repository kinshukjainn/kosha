import React from "react";
import Link from "next/link";
import {
  FiSettings,
  FiShield,
  FiBell,
  FiUser,
  FiArrowLeft,
} from "react-icons/fi";

export default function SettingsComingSoon() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-6  relative overflow-hidden">
      {/* Subtle Background Glow for premium feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0078D4]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <main className="w-full max-w-xl relative animate-in fade-in zoom-in-95 duration-500 ease-out">
        {/* Card Component */}
        <div className="  overflow-hidden flex flex-col">
          {/* Top Edge Highlight */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0078D4] to-transparent opacity-50" />

          <div className="p-8 sm:p-10 flex flex-col items-center text-center">
            {/* Animated Icon Wrapper */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-[#0078D4]/20 rounded-full blur-xl animate-pulse" />
              <div className="w-20 h-20 bg-[#171717] border border-[#3d3d3d] rounded-2xl flex items-center justify-center relative z-10 shadow-inner">
                <FiSettings className="w-10 h-10 text-[#0078D4] animate-[spin_6s_linear_infinite]" />
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#2d2d2d]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0078D4] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0078D4]"></span>
              </span>
              <span className="text-[12px] font-medium text-gray-300 uppercase tracking-wider">
                In Development
              </span>
            </div>

            {/* Headings */}
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-100 tracking-tight mb-3">
              Settings & Preferences
            </h1>
            <p className="text-[14px] sm:text-[15px] text-gray-400 leading-relaxed max-w-md mx-auto">
              We are currently building a comprehensive control center for your
              account. Soon, you will be able to customize your Kosha experience
              down to the finest detail.
            </p>

            {/* Feature Preview Grid */}
            <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#2d2d2d] pt-8">
              <div className="flex flex-col items-center p-3 rounded-xl bg-[#171717] border border-[#2d2d2d]/50">
                <FiUser className="w-5 h-5 text-gray-400 mb-2" />
                <span className="text-[13px] font-medium text-gray-200">
                  Profile
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5">
                  Customization
                </span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl bg-[#171717] border border-[#2d2d2d]/50">
                <FiShield className="w-5 h-5 text-gray-400 mb-2" />
                <span className="text-[13px] font-medium text-gray-200">
                  Security
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5">
                  MFA & Sessions
                </span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl bg-[#171717] border border-[#2d2d2d]/50">
                <FiBell className="w-5 h-5 text-gray-400 mb-2" />
                <span className="text-[13px] font-medium text-gray-200">
                  Alerts
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5">
                  Notifications
                </span>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="bg-[#171717] px-8 py-5 border-t border-[#2d2d2d] flex justify-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-[14px] font-medium text-gray-300 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-[#252525]"
            >
              <FiArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors group-hover:-translate-x-1 duration-200" />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="mt-8 text-center text-[12px] text-gray-600 font-medium">
        Kosha Telemetry & Systems • v2.0-beta
      </footer>
    </div>
  );
}
