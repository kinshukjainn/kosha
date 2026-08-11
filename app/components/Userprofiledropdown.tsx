"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { FiLogOut, FiSettings, FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

interface UserProfileDropdownProps {
  variant?: "desktop" | "mobile";
  onAction?: () => void;
}

export default function UserProfileDropdown({
  variant = "desktop",
  onAction,
}: UserProfileDropdownProps) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Smooth, premium menu items ── */
  const menuItemClass =
    "w-full flex items-center cursor-pointer gap-3 py-2.5 px-4 text-[14px] text-gray-300 transition-colors duration-200 hover:bg-[#202020] hover:text-gray-100";

  const dangerMenuItemClass =
    "w-full flex items-center cursor-pointer gap-3 py-2.5 px-4 text-[14px] text-red-400 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-300";

  /* ── Outside click (desktop) ── */
  useEffect(() => {
    if (variant !== "desktop") return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [variant]);

  /* ── Esc to close ── */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  if (!user) return null;

  const displayName =
    user.fullName || user.firstName || user.username || "user";
  const email = user.primaryEmailAddress?.emailAddress || "";
  const avatarUrl = user.imageUrl;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleManage = () => {
    setIsOpen(false);
    onAction?.();
    openUserProfile();
  };

  const handleSignOut = () => {
    setIsOpen(false);
    onAction?.();
    signOut();
  };

  /* ── Fully rounded Avatar with clean status indicator ── */
  const renderAvatar = (size: number, showStatus = false) => {
    // Dynamic border color depending on whether it's on the trigger or inside the card
    const statusBorderColor = size === 32 ? "border-black" : "border-[#171717]";

    return (
      <div className="relative shrink-0">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={size}
            height={size}
            unoptimized
            className="object-cover border border-[#2d2d2d] rounded-full transition-all duration-300 grayscale hover:grayscale-0"
            style={{ width: size, height: size }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <span
            className="bg-[#202020] border border-[#3d3d3d] rounded-full text-gray-300 flex items-center justify-center font-medium"
            style={{
              width: size,
              height: size,
              fontSize: size < 32 ? 12 : 16,
            }}
          >
            {initials}
          </span>
        )}
        {showStatus && (
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 ${statusBorderColor}`}
            title="Online"
          />
        )}
      </div>
    );
  };

  /* ─────────────────────────────────────────────
     MOBILE — Inline rounded accordion
     ───────────────────────────────────────────── */
  if (variant === "mobile") {
    return (
      <div
        className="relative w-full border border-[#2d2d2d] rounded-xl bg-[#121212] overflow-hidden transition-all duration-200"
        ref={dropdownRef}
      >
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center gap-3 p-3.5 hover:bg-[#1a1a1a] transition-colors focus:outline-none"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {renderAvatar(36, true)}
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[14px] font-semibold text-gray-200 truncate">
              {displayName}
            </p>
          </div>
          <FiChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="bg-[#121212] border-t border-[#2d2d2d] pb-2 pt-1">
            <button onClick={handleManage} className={menuItemClass}>
              <FiSettings className="w-4 h-4 shrink-0 text-gray-400" />
              <span>Settings</span>
            </button>
            <button onClick={handleSignOut} className={dangerMenuItemClass}>
              <FiLogOut className="w-4 h-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     DESKTOP — Pill trigger & rounded dropdown
     ───────────────────────────────────────────── */
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Pill-shaped Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2.5 p-1 pr-4 rounded-full border transition-all duration-200 outline-none focus:ring-2 focus:ring-[#0078D4] focus:ring-offset-2 focus:ring-offset-black ${
          isOpen
            ? "border-[#3d3d3d] bg-[#1a1a1a]"
            : "border-[#2d2d2d] hover:border-[#3d3d3d] hover:bg-[#1a1a1a]"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {renderAvatar(32, true)}
        <span className="text-[13px] font-medium text-gray-200">
          {displayName}
        </span>
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#121212] border border-[#2d2d2d] shadow-xl shadow-black z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
          {/* User Info Header */}
          <div className="p-4 flex items-start gap-3 bg-[#171717] border-b border-[#2d2d2d]">
            {renderAvatar(44, false)}
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-gray-100 truncate">
                {displayName}
              </p>
              {email && (
                <p className="text-[12px] text-gray-400 truncate mt-0.5">
                  {email}
                </p>
              )}
              {/* Modern Pulse Online Badge */}
              <div className="mt-2.5 text-[11px] font-semibold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full w-max flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Online
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="py-2 flex flex-col">
            <Link href="/user-settings" className={menuItemClass}>
              <FiSettings className="w-4 h-4 shrink-0 text-gray-400" />
              <span className="flex-1 text-left">Settings</span>
            </Link>

            <button onClick={handleSignOut} className={dangerMenuItemClass}>
              <FiLogOut className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
