"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

import { FaGithub } from "react-icons/fa";
import UserProfileDropdown from "./Userprofiledropdown";
import {
  PanelBottomClose,
  PanelBottomOpen,
  LayoutDashboard,
  FileStack,
  Users,
  GitBranch,
  Ticket,
  CreditCard,
  LogIn,
  MessageSquareText,
} from "lucide-react";
import { FaMessage } from "react-icons/fa6";

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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all bg-[#161923] border-b border-[#181818] duration-500  mx-auto backdrop-saturate-150`}
    >
      <div className="flex items-center justify-between h-14 px-4 md:px-6 max-w-screen-2xl mx-auto">
        {/* ── Logo ── */}
        <Link
          href="/"
          onClick={close}
          className="flex items-center gap-2.5 py-1.5  transition-all shrink-0 group"
        >
          <Image
            src="/anylogo.png"
            alt="Kosha"
            width={40}
            height={40}
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <span className="font-normal text-[33px] tracking-wider  text-gray-100">
            Kosha
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1 flex-1 px-8 overflow-x-auto no-scrollbar mask-fade-edges">
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

        {/* ── Desktop Right Actions ── */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <a
            href="https://opaque.cloudkinshuk.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="
    inline-flex items-center gap-3
    px-2 sm:px-5 py-1
    rounded-xl
    bg-green-800 backdrop-blur-md
    border border-white/10
    text-white
    font-medium
    text-xs sm:text-base
    w-fit
  "
            aria-label="Kosha"
          >
            <Image
              src="/logog.png"
              alt="Kosha"
              width={28}
              height={28}
              className="rounded-md object-cover"
            />

            <span className="whitespace-nowrap">Open Opaque</span>
          </a>
          <a
            href="https://github.com/kinshukjainn/pvtcldstrg"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="GitHub"
          >
            <FaGithub className="w-4 h-4" />
          </a>
          <a
            href="https://clkfeedbacks.cloudkinshuk.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Feedback"
          >
            <MessageSquareText className="w-4 h-4" />
          </a>

          <div className="w-px h-5 bg-white/10" />

          {isLoaded && !userId && (
            <Link
              href="/verify-regis"
              className="flex items-center gap-2 px-4 py-1.5 bg-white hover:bg-gray-200 text-black text-xs font-bold tracking-wide rounded-lg transition-all active:scale-95 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_2px_8px_-2px_rgba(0,0,0,0.4)]"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In / Up
            </Link>
          )}
          {isLoaded && userId && (
            <div className="p-1 rounded-lg hover:bg-white/5 transition-colors">
              <UserProfileDropdown variant="desktop" />
            </div>
          )}
        </div>

        {/* ── Mobile Toggle ── */}
        <button
          className="md:hidden p-2 cursor-pointer rounded-lg text-white hover:bg-white/5 transition-all active:scale-95"
          onClick={toggle}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? (
            <PanelBottomOpen className="w-6 h-6" />
          ) : (
            <PanelBottomClose className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* ── Mobile Menu — FIXED Reliable Glassmorphism ── */}
      <div
        className={`md:hidden absolute top-full left-0 right-0
          bg-[#161923] backdrop-blur-xl
          border-x border-b border-white/10
          rounded-b-3xl overflow-hidden
          shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)]
          transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] origin-top
          ${
            open
              ? "max-h-[calc(100vh-3.5rem)] opacity-100 translate-y-0 visible"
              : "max-h-0 opacity-0 -translate-y-1 invisible pointer-events-none"
          }`}
      >
        <div className="relative overflow-y-auto max-h-[calc(100vh-3.5rem)] pb-6">
          <nav className="flex flex-col p-1.5 gap-1">
            {isLoaded && userId && (
              <MobileNavLink
                href="/dashboard"
                icon={LayoutDashboard}
                onClick={close}
              >
                Dashboard
              </MobileNavLink>
            )}
            {NAV_LINKS.map(({ href, label, icon }) => (
              <MobileNavLink key={href} href={href} icon={icon} onClick={close}>
                {label}
              </MobileNavLink>
            ))}

            <a
              href="https://opaque.cloudkinshuk.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="
    inline-flex items-center gap-3
    px-2 sm:px-5 py-2
    rounded-xl flex justify-center
    bg-green-800 backdrop-blur-md
    border border-white/10
    text-white
    font-medium
    text-xs sm:text-base
    w-full
  "
              aria-label="Kosha"
            >
              <Image
                src="/logog.png"
                alt="Kosha"
                width={28}
                height={28}
                className="rounded-md object-cover"
              />

              <span className="whitespace-nowrap">Open Opaque</span>
            </a>
            <a
              href="https://github.com/kinshukjainn/pvtcldstrg"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] font-medium text-gray-300 hover:text-white  transition-all duration-300"
            >
              <div className="w-9 h-9 flex items-center justify-center   transition-all duration-300">
                <FaGithub className="w-6 h-6 text-white  transition-colors" />
              </div>
              <span className="flex-1">Open Source</span>
              <span className="text-[11px] text-gray-500 group-hover:text-gray-300 transition-colors">
                ↗
              </span>
            </a>
            <a
              href="https://github.com/kinshukjainn/pvtcldstrg"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] font-medium text-gray-300 hover:text-white  transition-all duration-300"
            >
              <div className="w-9 h-9 flex items-center justify-center   transition-all duration-300">
                <FaMessage className="w-6 h-6 text-white  transition-colors" />
              </div>
              <span className="flex-1">Feedbacks</span>
              <span className="text-[11px] text-gray-500 group-hover:text-gray-300 transition-colors">
                ↗
              </span>
            </a>

            {isLoaded && !userId && (
              <div className="px-2 pt-4">
                <Link
                  href="/verify-regis"
                  onClick={close}
                  className="relative flex items-center justify-center gap-2 w-full bg-white text-black text-sm font-bold tracking-wide py-3.5 rounded-lg transition-all hover:bg-gray-200 active:scale-[0.98] shadow-lg"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In / Up
                </Link>
              </div>
            )}

            {isLoaded && userId && (
              <div className="mt-2 pt-3 border-t border-white/5">
                <UserProfileDropdown variant="mobile" onAction={close} />
              </div>
            )}
          </nav>
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
  underline = false,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  underline?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[15px] font-medium text-white hover:underline group-hover:text-green-500 transition-colors whitespace-nowrap ${
        underline
          ? "underline decoration-white/20 underline-offset-4 hover:decoration-gray-400"
          : ""
      }`}
    >
      <Icon className="w-4 h-4 shrink-0 text-white group-hover:text-green-500 " />
      {children}
    </Link>
  );
}

/* ── Mobile NavLink — refined glass pill ── */
function MobileNavLink({
  href,
  icon: Icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative flex items-center gap-2 px-4  text-white text-md  hover:border-l-3 hover:border-blue-400 transition-all duration-300"
    >
      {/* Icon tile */}
      <div className="w-9 h-9 flex items-center justify-center   transition-all duration-300">
        <Icon className="w-6 h-6 text-white  transition-colors" />
      </div>
      <span className="flex-1">{children}</span>
      {/* Reveal arrow on hover */}
      <span className="text-gray-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        →
      </span>
    </Link>
  );
}
