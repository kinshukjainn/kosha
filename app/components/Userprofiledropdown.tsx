"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { FiLogOut, FiSettings, FiChevronDown } from "react-icons/fi";
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

  /* ── Utilitarian menu items, no transitions ── */
  const menuItemClass =
    "w-full flex items-center cursor-pointer gap-3 py-2 px-3 text-sm  text-white hover:font-bold";

  const dangerMenuItemClass =
    "w-full flex items-center cursor-pointer gap-3 py-2 px-3 text-sm  text-white hover:font-bold";

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
    .toLowerCase();

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

  /* ── Square Avatar with static status block ── */
  const renderAvatar = (size: number, showStatus = false) => {
    return (
      <div className="relative shrink-0">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={size}
            height={size}
            unoptimized
            className="object-cover border border-gray-600 rounded-lg grayscale hover:grayscale-0"
            style={{ width: size, height: size }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <span
            className="bg-zinc-900 border border-gray-600 rounded-full text-gray-300  flex items-center justify-center"
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
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-black"
            title="Online"
          />
        )}
      </div>
    );
  };

  /* ─────────────────────────────────────────────
     MOBILE — Inline flat accordion
     ───────────────────────────────────────────── */
  if (variant === "mobile") {
    return (
      <div
        className="relative w-full border border-gray-700 rounded-lg bg-[#161923] "
        ref={dropdownRef}
      >
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center gap-3 p-3 "
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {renderAvatar(36, true)}
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm text-green-500 truncate">~/{displayName}</p>
          </div>
          <FiChevronDown
            className={`w-4 h-4 text-white ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="rounded-xl bg-[#161923] pb-1">
            <button onClick={handleManage} className={menuItemClass}>
              <FiSettings className="w-5 h-5 shrink-0 text-white" />
              <span>settings</span>
            </button>
            <button onClick={handleSignOut} className={dangerMenuItemClass}>
              <FiLogOut className="w-5 h-5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     DESKTOP — Sharp dropdown box
     ───────────────────────────────────────────── */
  return (
    <div className="relative " ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 pl-1 pr-2 py-2 px-4   border cursor-pointer outline-none ${
          isOpen ? "border-gray-500 " : "border hover:border-gray-600 "
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {renderAvatar(24, true)}
        <span className="text-sm text-gray-300">{displayName}</span>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0   rounded-xl bg-[#161923] border border-gray-700  z-50">
          {/* User Info Header */}
          <div className="p-4 flex items-start gap-3 ">
            {renderAvatar(40, false)}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-200 truncate">
                {displayName}
              </p>
              {email && (
                <p className="text-xs text-gray-500 truncate mt-1">{email}</p>
              )}
              <div className="mt-2 text-xs text-white  px-2 py-1 bg-green-700 w-max rounded-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full inline-block"></span>{" "}
                Online
              </div>
            </div>
          </div>

          {/* Solid divider */}
          <div className="h-px bg-gray-700" />

          {/* Action Buttons */}
          <div className="py-1 flex flex-col">
            <button onClick={handleManage} className={menuItemClass}>
              <FiSettings className="w-4 h-4 shrink-0 text-white" />
              <span className="flex-1 text-left">Settings </span>
            </button>

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
