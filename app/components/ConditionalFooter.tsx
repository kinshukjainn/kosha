"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Footer from "./Footer"; // Dark theme footer

export default function ConditionalFooter() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();

  // Prevent UI flickering while Clerk is determining the auth state
  if (!isLoaded) return null;

  // 1. Hide the footer entirely on these specific routes (regardless of auth state)
  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/projects") ||
    pathname?.startsWith("/verify-regis") ||
    pathname?.startsWith("/tickets") ||
    pathname?.startsWith("/trials") ||
    pathname?.startsWith("/console-v2")
  ) {
    return null;
  }

  // 2. Conditional logic specifically for the Home Page ("/")
  if (pathname === "/") {
    if (isSignedIn) {
      // If logged in, do not show the footer on the home route
      return null;
    } else {
      // If logged out, show the Light Theme Footer on the home route
      return <Footer />;
    }
  }

  // 3. Show the Dark Theme Footer for all other remaining routes
  return <Footer />;
}
