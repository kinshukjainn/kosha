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
} from "lucide-react";

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
  const [scrolled, setScrolled] = useState(false);

  const toggle = () => setOpen((o) => !o);
  const close = () => setOpen(false);

  // Subtle elevation change when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300
        bg-[#0f0f10]/70 backdrop-blur-xl backdrop-saturate-150
        border-b ${
          scrolled
            ? "border-white/10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.6)]"
            : "border-white/5 shadow-none"
        }`}
    >
      {/* Top hairline highlight for that "glass edge" feel */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex items-center justify-between h-14 px-4 max-w-screen-2xl mx-auto">
        {/* ── Logo ── */}
        <Link
          href="/"
          onClick={close}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all shrink-0 group"
        >
          <Image
            src="/anylogo.png"
            alt="Kosha"
            width={28}
            height={28}
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <span className="font-bold text-[15px] tracking-wider text-gray-100">
            KOSHA
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1 flex-1 px-6 overflow-x-auto no-scrollbar mask-fade-edges">
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
            href="https://github.com/kinshukjainn/pvtcldstrg"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="GitHub"
          >
            <FaGithub className="w-4 h-4" />
          </a>

          <div className="w-px h-5 bg-white/10" />

          {isLoaded && !userId && (
            <Link
              href="/verify-regis"
              className="flex items-center gap-2 px-4 py-1.5 bg-white hover:bg-gray-200 text-black text-xs font-bold tracking-wide rounded-full transition-all active:scale-95 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_2px_8px_-2px_rgba(0,0,0,0.4)]"
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
          className="md:hidden p-2 rounded-lg text-white hover:bg-white/5 transition-all active:scale-95"
          onClick={toggle}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? (
            <PanelBottomOpen className="w-5 h-5" />
          ) : (
            <PanelBottomClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden absolute top-full left-0 w-full
          bg-[#0f0f10]/85 backdrop-blur-xl backdrop-saturate-150
          border-b border-white/10
          shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)]
          rounded-b-3xl overflow-hidden
          transition-all duration-300 ease-out origin-top
          ${
            open
              ? "max-h-[calc(100vh-3.5rem)] opacity-100 overflow-y-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
      >
        <nav className="flex flex-col py-2">
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

          <div className="h-px bg-white/10 my-2 mx-5" />

          <a
            href="https://github.com/kinshukjainn/pvtcldstrg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all"
          >
            <FaGithub className="w-5 h-5 text-gray-400" />
            Open Source
          </a>

          {isLoaded && !userId && (
            <div className="px-5 py-4">
              <Link
                href="/verify-regis"
                onClick={close}
                className="flex items-center justify-center gap-2 w-full bg-white text-black text-sm font-bold tracking-wide py-3 rounded-full transition-all active:scale-[0.98] shadow-[0_2px_12px_-2px_rgba(0,0,0,0.5)]"
              >
                <LogIn className="w-4 h-4" />
                Sign In / Up
              </Link>
            </div>
          )}

          {isLoaded && userId && (
            <div className="px-5 py-4 bg-white/[0.02] border-t border-white/10">
              <UserProfileDropdown variant="mobile" onAction={close} />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

/* ── Shared Sub-components ── */
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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-100 hover:bg-white/5 hover:text-gray-100 transition-all whitespace-nowrap ${
        underline
          ? "underline decoration-white/20 underline-offset-4 hover:decoration-gray-400"
          : ""
      }`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0 opacity-70" />
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  icon: Icon,
  children,
  underline = false,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  underline?: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all ${
        underline ? "underline decoration-white/20 underline-offset-4" : ""
      }`}
    >
      <Icon className="w-5 h-5 text-gray-400 shrink-0" />
      {children}
    </Link>
  );
}
