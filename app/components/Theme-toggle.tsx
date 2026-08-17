"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    // Skeleton placeholder to prevent layout shift before hydration
    return (
      <div className="w-[44px] h-[44px] rounded-full dark:bg-[#252525] bg-gray-300 flex-shrink-0" />
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.85 }} // Extreme haptic "squish" feel
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex items-center justify-center p-2.5 w-[44px] h-[44px] rounded-full cursor-pointer bg-gray-300 dark:bg-[#252525] text-black  dark:text-white transition-colors flex-shrink-0 shadow-sm overflow-hidden"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{
            duration: 0.2,
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="absolute flex items-center justify-center"
        >
          {theme === "dark" ? (
            <Moon className="h-5 w-5 dark:text-yellow-300" />
          ) : (
            <Sun className="h-5 w-5 text-black" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
