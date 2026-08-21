export default function ComingSoonPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-black text-black dark:text-white px-4 transition-colors duration-300">
      <div className="max-w-xl w-full text-center space-y-6">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl h-font font-semibold tracking-tight">
          Coming Soon
        </h1>

        {/* Subtitle Message */}
        <p className="text-lg sm:text-xl text-zinc-800 dark:text-zinc-400 font-medium">
          Our trials are launching soon. Get ready to experience something
          amazing.
        </p>

        {/* Minimal Sub-element / Accent */}
        <div className="pt-4">
          <span className="inline-block h-1 w-12 bg-black dark:bg-white rounded-full"></span>
        </div>
      </div>
    </main>
  );
}
