// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Add your custom font here
        lucida: "var(--font-lucida) , sans-serif",
        segoeui: "var(--font-segoeui) , sans-serif",
        ubuntu: "var(--font-ubuntu) , sans-serif",
        supermercado: "var(--font-supermercado) , sans-serif",
        varelaRound: "var(--font-varela-round) , sans-serif",
        geist: "var(--font-geist-mono) , monospaced",
        roboto: "var(--font-roboto) , sans-serif",
        publicSans: "var(--font-public-sans) , sans-serif",
        poppins: "var(--font-poppins) , sans-serif",
        googleSans: "var(--font-google-sans) , sans-serif",
        dmSans: "var(--font-dm-sans) , sans-serif",
        plusJakarta: "var(--font-plus-jakarta) , sans-serif",
        inter: "var(--font-inter) , sans-serif",
        notoSerif: "var(--font-noto-serif) , serif",
        verdana: "var(--font-verdana) , sans-serif",
      },
    },
  },
  plugins: [],
};
export default config;
