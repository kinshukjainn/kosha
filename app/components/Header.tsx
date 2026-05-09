"use client";

import { useState } from "react";
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
  ShieldCheck,
  FileText,
  LogIn,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/supported-formats", label: "Supported Formats", icon: FileStack },
  { href: "/about-us", label: "About Us", icon: Users },
  { href: "/git-track", label: "Project Logs", icon: GitBranch },
  { href: "/openned-tickets", label: "Tickets", icon: Ticket },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  {
    href: "/privacy-policy",
    label: "Privacy Policy",
    icon: ShieldCheck,
    underline: true,
  },
  {
    href: "/terms-of-service",
    label: "Terms of Service",
    icon: FileText,
    underline: true,
  },
];

export default function Header() {
  const { isLoaded, userId } = useAuth();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((o) => !o);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-12 px-4 max-w-screen-2xl mx-auto">
        {/* ── Logo ── */}
        <Link
          href="/"
          onClick={close}
          className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
        >
          <Image
            src="/anylogo.png"
            alt="Kosha"
            width={28}
            height={28}
            className="object-contain"
          />
          <span className="font-bold text-[15px] tracking-wide text-gray-900">
            KOSHA
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 px-4 overflow-x-auto">
          {isLoaded && userId && (
            <NavLink href="/dashboard" icon={LayoutDashboard}>
              Dashboard
            </NavLink>
          )}
          {NAV_LINKS.map(({ href, label, icon, underline }) => (
            <NavLink key={href} href={href} icon={icon} underline={underline}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Desktop right actions ── */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <a
            href="https://github.com/kinshukjainn/pvtcldstrg"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="GitHub"
          >
            <FaGithub className="w-4 h-4 text-gray-700" />
          </a>

          <div className="w-px h-4 bg-gray-200" />

          {isLoaded && !userId && (
            <Link
              href="/verify-regis"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full transition-colors"
            >
              <LogIn className="w-3 h-3" />
              Sign In / Up
            </Link>
          )}
          {isLoaded && userId && (
            <div className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <UserProfileDropdown variant="desktop" />
            </div>
          )}
        </div>

        {/* ── Mobile toggle ── */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={toggle}
          aria-label="Toggle menu"
        >
          {open ? (
            <PanelBottomOpen className="w-5 h-5 text-gray-700" />
          ) : (
            <PanelBottomClose className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      <div
        className={`md:hidden absolute top-12 left-0 w-full bg-white border-b border-gray-200 shadow-lg transition-all duration-200 origin-top overflow-hidden ${
          open
            ? "max-h-[80vh] opacity-100 overflow-y-auto"
            : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col py-1">
          {isLoaded && userId && (
            <MobileNavLink
              href="/dashboard"
              icon={LayoutDashboard}
              onClick={close}
            >
              Dashboard
            </MobileNavLink>
          )}
          {NAV_LINKS.map(({ href, label, icon, underline }) => (
            <MobileNavLink
              key={href}
              href={href}
              icon={icon}
              underline={underline}
              onClick={close}
            >
              {label}
            </MobileNavLink>
          ))}

          <div className="h-px bg-gray-100 my-1 mx-4" />

          <a
            href="https://github.com/kinshukjainn/pvtcldstrg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FaGithub className="w-5 h-5 text-gray-500" />
            Open Source
          </a>

          {isLoaded && !userId && (
            <div className="px-4 py-3">
              <Link
                href="/verify-regis"
                onClick={close}
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In / Up
              </Link>
            </div>
          )}

          {isLoaded && userId && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <UserProfileDropdown variant="mobile" onAction={close} />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

/* ── Shared sub-components ── */
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
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors whitespace-nowrap ${underline ? "underline underline-offset-2" : ""}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
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
      className={`flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-blue-600 transition-colors border-b border-gray-50 ${underline ? "underline underline-offset-2" : ""}`}
    >
      <Icon className="w-5 h-5 text-gray-400 shrink-0" />
      {children}
    </Link>
  );
}
