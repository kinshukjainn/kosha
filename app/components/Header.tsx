"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

import { FaGithub } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import UserProfileDropdown from "./Userprofiledropdown";
import ThemeToggle from "./Theme-toggle"; // Ensure the casing matches your file exactly
import {
  LayoutDashboard,
  FileStack,
  Users,
  GitBranch,
  Ticket,
  CreditCard,
  LogIn,
  MessageSquareText,
} from "lucide-react";
import { CgMenuRound } from "react-icons/cg";

const NAV_LINKS = [
  { href: "/supported-formats", label: "Supported Formats", icon: FileStack },
  { href: "/about-us", label: "About Us", icon: Users },
  { href: "/git-track", label: "Project Logs", icon: GitBranch },
  { href: "/openned-tickets", label: "Tickets", icon: Ticket },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
];

export default function Header() {
  const { isLoaded, userId } = useAuth();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((o) => !o);
  const close = () => setOpen(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-transparent transition-colors duration-300">
      <div className="flex items-center justify-between h-[72px] px-4 md:px-6 max-w-[1600px] mx-auto">
        {/* ── Logo ── */}
        <Link
          href="/"
          onClick={close}
          className="flex items-center gap-2 shrink-0 group outline-none"
        >
          <div className="p-1.5 bg-gray-100 dark:bg-transparent rounded-full border border-gray-200 dark:border-transparent transition-colors">
            <Image
              src="/anylogo.png"
              alt="Kosha"
              width={32}
              height={32}
              className="object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="font-bold text-[24px] md:text-[28px] h-font uppercase tracking-wider text-black dark:text-gray-100">
            Kosha
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center px-4">
          {isLoaded && userId && (
            <NavLink href="/dashboard" icon={LayoutDashboard}>
              Dashboard
            </NavLink>
          )}
          {NAV_LINKS.map(({ href, label, icon }) => (
            <NavLink key={href} href={href} icon={icon}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Right Actions (Desktop & Mobile) ── */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Desktop Only Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://opaque.cloudkinshuk.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 dark:bg-green-800/80 dark:hover:bg-green-700 backdrop-blur-md border border-green-700 dark:border-white/10 text-white font-medium text-sm transition-all shadow-sm active:scale-95"
            >
              <Image
                src="/logog.png"
                alt="Opaque"
                width={20}
                height={20}
                className="rounded-[4px] object-cover"
              />
              <span>Open Opaque</span>
            </a>

            <div className="flex items-center gap-1">
              <a
                href="https://github.com/kinshukjainn/pvtcldstrg"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                aria-label="GitHub"
              >
                <FaGithub className="w-[18px] h-[18px]" />
              </a>
              <a
                href="https://clkfeedbacks.cloudkinshuk.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                aria-label="Feedback"
              >
                <MessageSquareText className="w-[18px] h-[18px]" />
              </a>
            </div>

            <div className="w-px h-6 bg-gray-200 dark:bg-white/10" />

            {isLoaded && !userId && (
              <Link
                href="/verify-regis"
                className="flex items-center gap-2 px-5 py-2 bg-gray-100 dark:bg-white hover:bg-gray-200 dark:hover:bg-gray-200 text-black text-sm font-bold rounded-full transition-all active:scale-95 border border-gray-200 dark:border-transparent shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
            {isLoaded && userId && (
              <div className="hover:opacity-80 transition-opacity flex items-center">
                <UserProfileDropdown variant="desktop" />
              </div>
            )}
          </div>

          {/* Theme Toggle (Always Visible) */}
          <ThemeToggle />

          {/* Mobile Menu Toggle (Always visible on mobile) */}
          <button
            className="md:hidden flex items-center justify-center w-[44px] h-[44px] rounded-full text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-transparent border border-gray-200 dark:border-transparent hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors active:scale-95 shadow-sm dark:shadow-none"
            onClick={toggle}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <CgMenuRound className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu (Tile Grid) ── */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-black backdrop-blur-md rounded-b-3xl border-b border-gray-200 dark:border-white/10 shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          open
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div
          className={`grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-4 p-4 max-h-[calc(100vh-72px)] overflow-y-auto no-scrollbar">
              {/* ── Navigation Tile Grid ── */}
              <div className="grid grid-cols-2 gap-3">
                {isLoaded && userId && (
                  <MobileTile
                    href="/dashboard"
                    icon={LayoutDashboard}
                    onClick={close}
                  >
                    Dashboard
                  </MobileTile>
                )}
                {NAV_LINKS.map(({ href, label, icon }) => (
                  <MobileTile
                    key={href}
                    href={href}
                    icon={icon}
                    onClick={close}
                  >
                    {label}
                  </MobileTile>
                ))}
              </div>

              {/* ── Open Opaque (full‑width tile) ── */}
              <a
                href="https://opaque.cloudkinshuk.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl bg-green-600 dark:bg-green-800/90 hover:bg-green-700 dark:hover:bg-green-700 border border-green-700 dark:border-white/10 text-white font-bold text-[15px] shadow-sm active:scale-[0.98] transition-all"
              >
                <Image
                  src="/logog.png"
                  alt="Opaque"
                  width={20}
                  height={20}
                  className="rounded-sm"
                />
                Open Opaque
              </a>

              {/* ── GitHub & Feedback (side‑by‑side small tiles) ── */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://github.com/kinshukjainn/pvtcldstrg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-3.5 rounded-xl bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors shadow-sm dark:shadow-none"
                >
                  <FaGithub className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="font-semibold text-sm">Open Source</span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs ml-auto">
                    ↗
                  </span>
                </a>
                <a
                  href="https://clkfeedbacks.cloudkinshuk.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-3.5 rounded-xl bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors shadow-sm dark:shadow-none"
                >
                  <FaMessage className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="font-semibold text-sm">Feedbacks</span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs ml-auto">
                    ↗
                  </span>
                </a>
              </div>

              {/* ── Sign‑in / User Profile ── */}
              {isLoaded && !userId && (
                <Link
                  href="/verify-regis"
                  onClick={close}
                  className="flex items-center justify-center gap-2 w-full bg-black dark:bg-white text-white dark:text-black text-[15px] font-bold py-3.5 rounded-full transition-all active:scale-[0.98] shadow-md mt-2"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In / Up
                </Link>
              )}
              {isLoaded && userId && (
                <div className="flex justify-center mt-2 mb-2">
                  <UserProfileDropdown variant="mobile" onAction={close} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Desktop NavLink ── */
function NavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-[14px] font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all group whitespace-nowrap outline-none"
    >
      <Icon className="w-[18px] h-[18px] text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-green-400 transition-colors" />
      {children}
    </Link>
  );
}

/* ── Mobile Tile (used in the grid) ── */
function MobileTile({
  href,
  icon: Icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none transition-all active:scale-95 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white outline-none"
    >
      <Icon className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-white transition-colors" />
      <span className="text-[13px] font-bold text-center transition-colors">
        {children}
      </span>
    </Link>
  );
}
