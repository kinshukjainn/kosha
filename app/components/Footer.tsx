import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black mt-auto border-t border-neutral-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col xl:flex-row justify-between items-start gap-10 xl:gap-16">
          {/* Brand Identity */}
          <div className="flex flex-col gap-4 max-w-md">
            <div className="flex items-center gap-3 text-neutral-900 dark:text-white font-bold text-2xl tracking-tight">
              <div className="p-1.5 bg-neutral-100 dark:bg-white/5 rounded-xl border border-neutral-200 dark:border-white/10 shadow-sm">
                <Image
                  src="/anylogo.png"
                  alt="Kosha Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span>KOSHA</span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              The personal cloud storage solution tailored for security, scale,
              and performance. Build, deploy, and manage your assets with
              enterprise-grade reliability.
            </p>
          </div>

          {/* Unique Minimalist Grouped Links */}
          <div className="flex flex-col gap-3 w-full xl:w-auto">
            {/* Platform Group */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 bg-neutral-50 dark:bg-zinc-900/40 rounded-2xl px-5 py-4 sm:py-3.5 border border-neutral-200 dark:border-white/5 transition-colors hover:border-neutral-300 dark:hover:border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-200 w-24">
                Platform
              </h3>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/supported-formats"
                  className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Supported Formats
                </Link>
              </div>
            </div>

            {/* Resources Group */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 bg-neutral-50 dark:bg-zinc-900/40 rounded-2xl px-5 py-4 sm:py-3.5 border border-neutral-200 dark:border-white/5 transition-colors hover:border-neutral-300 dark:hover:border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-200 w-24">
                Resources
              </h3>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <Link
                  href="/git-track"
                  className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Project Logs
                </Link>
                <Link
                  href="/openned-tickets"
                  className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Opened Tickets
                </Link>
                <Link
                  href="/about-us"
                  className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </div>
            </div>

            {/* Legal Group */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 bg-neutral-50 dark:bg-zinc-900/40 rounded-2xl px-5 py-4 sm:py-3.5 border border-neutral-200 dark:border-white/5 transition-colors hover:border-neutral-300 dark:hover:border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-200 w-24">
                Legal
              </h3>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <Link
                  href="/privacy-policy"
                  className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-of-service"
                  className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Socials & Copyright */}
        <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-500 font-medium tracking-wide">
            © {currentYear} Kosha. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <svg
                className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.95H5.059z" />
              </svg>
              <span className="hidden sm:inline">Twitter</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg
                className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
