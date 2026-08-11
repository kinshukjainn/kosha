"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

import { FaGithub } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import UserProfileDropdown from "./Userprofiledropdown";
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
    <header className="sticky top-0 z-50 w-full bg-black  transition-colors duration-300">
      <div className="flex items-center justify-between h-16 px-4 md:px-6 max-w-screen-2xl mx-auto">
        {/* ── Logo ── */}
        <Link
          href="/"
          onClick={close}
          className="flex items-center gap-2 shrink-0 group"
        >
          <Image
            src="/anylogo.png"
            alt="Kosha"
            width={36}
            height={36}
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <span className="font-bold text-[24px] md:text-[28px] tracking-wider text-gray-100">
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

        {/* ── Desktop Right Actions ── */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <a
            href="https://opaque.cloudkinshuk.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-800/80 hover:bg-green-700 backdrop-blur-md border border-white/10 text-white font-medium text-sm transition-all shadow-sm"
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
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="GitHub"
            >
              <FaGithub className="w-[18px] h-[18px]" />
            </a>
            <a
              href="https://clkfeedbacks.cloudkinshuk.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Feedback"
            >
              <MessageSquareText className="w-[18px] h-[18px]" />
            </a>
          </div>

          <div className="w-px h-6 bg-white/10" />

          {isLoaded && !userId && (
            <Link
              href="/verify-regis"
              className="flex items-center gap-2 px-5 py-2 bg-white hover:bg-gray-200 text-black text-sm font-bold rounded-full transition-all active:scale-95 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
          {isLoaded && userId && (
            <div className="hover:opacity-80 transition-opacity">
              <UserProfileDropdown variant="desktop" />
            </div>
          )}
        </div>

        {/* ── Mobile Toggle ── */}
        <button
          className="md:hidden p-2 -mr-2 rounded-full text-gray-300 hover:text-white cursor-pointer hover:bg-white/10 transition-all active:scale-95"
          onClick={toggle}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? (
            <CgMenuRound className="w-6 h-6" />
          ) : (
            <CgMenuRound className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-black backdrop-blur-md rounded-b-2xl border-b border-white/10 shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          open
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Using grid transition for buttery smooth height animation */}
        <div
          className={`grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-2 p-4 max-h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
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
                <MobileNavLink
                  key={href}
                  href={href}
                  icon={icon}
                  onClick={close}
                >
                  {label}
                </MobileNavLink>
              ))}

              <hr className="my-2 border-white/10" />

              <a
                href="https://opaque.cloudkinshuk.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-green-800/90 border border-white/10 text-white font-medium text-sm active:scale-[0.98] transition-all"
              >
                <Image
                  src="/logog.png"
                  alt="Kosha"
                  width={20}
                  height={20}
                  className="rounded-sm"
                />
                Open Opaque
              </a>

              <a
                href="https://github.com/kinshukjainn/pvtcldstrg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
              >
                <FaGithub className="w-5 h-5 text-gray-400" />
                <span className="flex-1 font-medium">Open Source</span>
                <span className="text-gray-500 text-xs">↗</span>
              </a>

              <a
                href="https://clkfeedbacks.cloudkinshuk.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
              >
                <FaMessage className="w-5 h-5 text-gray-400" />
                <span className="flex-1 font-medium">Feedbacks</span>
                <span className="text-gray-500 text-xs">↗</span>
              </a>

              {isLoaded && !userId && (
                <Link
                  href="/verify-regis"
                  onClick={close}
                  className="flex items-center justify-center gap-2 w-full mt-2 bg-white text-black text-sm font-bold py-3.5 rounded-full transition-all active:scale-[0.98]"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In / Up
                </Link>
              )}

              {isLoaded && userId && (
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-center">
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
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all group whitespace-nowrap"
    >
      <Icon className="w-[18px] h-[18px] text-gray-400 group-hover:text-green-400 transition-colors" />
      {children}
    </Link>
  );
}

/* ── Mobile NavLink ── */
function MobileNavLink({
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
      className="group flex items-center gap-3 px-4 py-3 rounded-full text-gray-300 text-sm font-medium  transition-all"
    >
      <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      <span className="flex-1 group-hover:text-white transition-colors">
        {children}
      </span>
      <span className="text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
        →
      </span>
    </Link>
  );
}
