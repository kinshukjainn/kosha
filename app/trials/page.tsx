import Link from "next/link";
import {
  HardDrive,
  Files,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
} from "lucide-react";

export default function TrialWelcomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#121212] text-zinc-900 dark:text-zinc-50  transition-colors duration-300">
      <main className="max-w-5xl mx-auto px-6 py-20 md:py-32">
        {/* Header Section */}
        <header className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm border-2 dark:border-blue-500 border-blue-800 font-bold rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
            <span className="flex h-2 w-2 rounded-full dark:bg-blue-500 bg-blue-800"></span>
            Trial Mode
          </div>
          <h1 className="text-4xl md:text-5xl font-medium h-font tracking-tight mb-6">
            Your trial for kosha.
          </h1>
          <p className="text-lg text-zinc-800 dark:text-zinc-300 leading-relaxed">
            Most cloud drives process your files through their servers before
            storing them. We don&apos;t. Kosha acts only as the gatekeeper your
            files travel directly from your device to the storage vault. Faster,
            safer, and entirely yours.
          </p>
        </header>

        {/* Plan Limits Grid */}
        <section className="mb-20">
          <h2 className="text-2xl h-font font-medium mb-6">
            Your Trial Limits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Storage Limit Card */}
            <div className="p-6 rounded-4xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
              <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <HardDrive className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              </div>
              <h3 className="font-semibold h-font text-lg mb-1">
                500 MB Storage
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Enough space to test out the platform with your essential
                documents, photos, and files.
              </p>
            </div>

            {/* File Count Limit Card */}
            <div className="p-6 rounded-4xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
              <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <Files className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              </div>
              <h3 className="font-semibold h-font text-lg mb-1">
                Up to 10 Files
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Keep your workspace organized. You can upload up to 10
                individual files during your trial.
              </p>
            </div>

            {/* Upload Size Limit Card */}
            <div className="p-6 rounded-4xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
              <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              </div>
              <h3 className="font-semibold h-font text-lg mb-1">
                50 MB Per File
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Generous individual file size limits, perfect for high-res
                images and standard PDFs.
              </p>
            </div>
          </div>
        </section>

        {/* Features / Non-technical architecture explanation */}
        <section className="mb-20">
          <h2 className="text-2xl h-font font-medium mb-6">
            What makes Kosha different?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-5 rounded-4xl bg-zinc-200 dark:bg-zinc-800/50">
              <Lock className="w-6 h-6 text-zinc-900 dark:text-zinc-100 shrink-0" />
              <div>
                <h4 className="font-semibold h-font mb-1">
                  Zero-Touch Uploads
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Your files are never held on our servers. We grant your
                  browser a secure, 60-second temporary key to place the file
                  directly into the vault.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-4xl bg-zinc-200 dark:bg-zinc-800/50">
              <ShieldCheck className="w-6 h-6 text-zinc-900 dark:text-zinc-100 shrink-0" />
              <div>
                <h4 className="font-semibold h-font mb-1">Clean Deletion</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  When you delete a file or your account, it is permanently
                  purged. We don&apos;t keep hidden backups of your deleted data
                  to sell or mine.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <Link
            href="/console-v2"
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-sm font-semibold rounded-full transition-all"
          >
            Set up trial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>
    </div>
  );
}
