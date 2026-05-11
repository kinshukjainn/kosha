"use client";

import React, {
  useState,
  useEffect,
  useRef,
  Suspense,
  type ReactNode,
  type ComponentType,
  type SVGProps,
} from "react";
import {
  ShieldCheck,
  Zap,
  Layout,
  ArrowRight,
  BrainCircuit,
  LockKeyhole,
  HardDrive,
  Check,
  FolderOpen,
  Upload,
  PartyPopper,
  Rocket,
  ChevronRight,
  BrickWallShield,
  FileCog,
  Cog,
} from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import HeroGrid from "./components/HeroGrid";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ── Words that cycle in the headline ── */
const WORDS = ["simple", "open-source", "private"] as const;

// "A simple" vs "An open-source" — pick the right article for the word.
const articleFor = (word: string) => (/^[aeiou]/i.test(word) ? "An" : "A");

/* ── Design tokens ── */
const INK = "#111827";
const INK_3 = "#6b7280";
const BLUE = "#2563eb";
const BLUE_SOFT = "#eff6ff";

/* ── Types ── */
type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}
interface Feature {
  id: string;
  title: string;
  body: string;
  icon: IconType;
}
interface OnboardingStepProps {
  icon: IconType;
  step: number;
  title: string;
  description: string;
  delay: number;
}
interface QuickActionProps {
  icon: IconType;
  title: string;
  description: string;
  href: string;
  delay: number;
}

/* ── Fade-in on scroll ── */
const useInView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView] as const;
};

const Reveal = ({ children, delay = 0, className = "" }: RevealProps) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(8px)",
        transition: `opacity .5s ease ${delay}ms, transform .5s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/* ── Greeting helper ── */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  return "Good evening";
};

/* ── New-user flag ── */
const useIsNewUser = () => {
  const searchParams = useSearchParams();
  return searchParams.get("new") === "true";
};

/* ── Buttons ── */
const PrimaryLink = ({
  children,
  href,
  className = "",
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) => (
  <Link
    href={href}
    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-blue-800 text-white transition hover:opacity-90 ${className}`}
  >
    {children}
  </Link>
);

const SecondaryLink = ({
  children,
  href,
  className = "",
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) => (
  <Link
    href={href}
    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121212] border border-[#444444] text-white text-sm font-medium ${className}`}
  >
    {children}
  </Link>
);

/* ── Onboarding step ── */
const OnboardingStep = ({
  icon: Icon,
  step,
  title,
  description,
  delay,
}: OnboardingStepProps) => (
  <Reveal delay={delay}>
    <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors">
      <span className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold text-gray-400 bg-gray-100">
        {step.toString().padStart(2, "0")}
      </span>
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: BLUE_SOFT }}
      >
        <Icon className="w-4 h-4" style={{ color: BLUE }} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold mb-0.5" style={{ color: INK }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: INK_3 }}>
          {description}
        </p>
      </div>
    </div>
  </Reveal>
);

/* ── Quick action ── */
const QuickAction = ({
  icon: Icon,
  title,
  description,
  href,
  delay,
}: QuickActionProps) => (
  <Reveal delay={delay}>
    <Link
      href={href}
      className="group flex items-center gap-4 p-5 rounded-3xl border border-[#444444] hover:border hover:border-blue-400 hover:shadow-md hover:shadow-blue-200 bg-[#121212] transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-white transition-colors">
          {title}
        </h3>
        <p className="text-sm" style={{ color: INK_3 }}>
          {description}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 shrink-0 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  </Reveal>
);

/* ── Hero — new user ── */
const NewUserHero = ({ firstName }: { firstName: string }) => (
  <div className="max-w-2xl mx-auto px-6 pt-20 pb-16">
    <Reveal>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 mb-6">
        <PartyPopper className="w-3 h-3" /> Account provisioned
      </span>
    </Reveal>

    <Reveal delay={80}>
      <h1
        className="text-4xl sm:text-5xl font-bold tracking-tight mb-6"
        style={{ color: INK }}
      >
        Welcome, {firstName}.
      </h1>
    </Reveal>

    <Reveal delay={160}>
      <p className="text-base leading-relaxed text-gray-600 mb-4 pl-4 border-l-2 border-blue-500">
        Your workspace is ready. You have{" "}
        <strong className="text-blue-600">5 GB</strong> of encrypted storage on{" "}
        <strong className="text-blue-600">AWS S3</strong> — private by default,
        yours forever. No credit card, no trial.
      </p>
    </Reveal>

    <Reveal delay={240}>
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-100 mb-10">
        <Check className="w-3.5 h-3.5" /> All systems go. You&apos;re in.
      </div>
    </Reveal>

    <Reveal delay={300}>
      <h2 className="text-xl font-semibold mb-4" style={{ color: INK }}>
        Quick start
      </h2>
    </Reveal>

    <div className="space-y-2.5 mb-10">
      <OnboardingStep
        icon={Upload}
        step={1}
        title="Upload your first file"
        description="Drag and drop any file into your dashboard — we support PDFs, images, documents, videos, and more."
        delay={360}
      />
      <OnboardingStep
        icon={FolderOpen}
        step={2}
        title="Organize with folders"
        description="Create folders to keep everything tidy. Your files, your structure."
        delay={420}
      />
      <OnboardingStep
        icon={ShieldCheck}
        step={3}
        title="Enjoy total privacy"
        description="Your files are encrypted and only accessible by you. No tracking, no ads, no compromises."
        delay={480}
      />
    </div>

    <Reveal delay={540}>
      <div className="flex flex-wrap items-center gap-4">
        <PrimaryLink href="/dashboard">
          <Rocket className="w-4 h-4" /> Go to Dashboard{" "}
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryLink>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-green-600" /> 5 GB Free
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-green-600" /> Secure
          </span>
        </div>
      </div>
    </Reveal>
  </div>
);

/* ── Hero — returning user ── */
const ReturningUserHero = ({ firstName }: { firstName: string }) => (
  <div className="max-w-2xl mx-auto px-6 pt-20 pb-16">
    <Reveal>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-white">
        {getGreeting()}, {firstName}.
      </h1>
    </Reveal>

    <Reveal delay={100}>
      <p className="text-base leading-relaxed text-gray-200 mb-10 pl-4 border-l-2 border-blue-500">
        System <strong className="text-blue-200">operational</strong>. Pick up
        where you left off.
      </p>
    </Reveal>

    <Reveal delay={200}>
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-200 mb-3">
        Jump back in
      </p>
    </Reveal>

    <div className="space-y-2.5">
      <QuickAction
        icon={FolderOpen}
        title="Open Dashboard"
        description="View and manage all your stored files"
        href="/dashboard"
        delay={260}
      />
      <QuickAction
        icon={Upload}
        title="Upload Files"
        description="Add new documents to your storage"
        href="/dashboard"
        delay={320}
      />
    </div>
  </div>
);

/* ── Animated headline ──
   Cycles "simple" → "open-source" → "private" with a smooth
   blur + slide + width-morph effect. All hooks live inside here. */
const AnimatedHeadline = () => {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  // Swap word every 3s to let the smooth morphing animation breathe.
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, 3000);
    return () => clearInterval(id);
  }, [reduce]);

  const current = WORDS[index];
  const article = articleFor(current);

  // Slower, fluid spring for a professional "morphing" width adjustment.
  // Lower stiffness + higher damping removes all "bounciness".
  const layoutSpring = {
    type: "spring" as const,
    stiffness: 150,
    damping: 24,
    mass: 1,
  };

  // Custom ease-out curve for a luxurious, slow-tail finish
  const premiumEase = [0.16, 1, 0.3, 1] as const;

  return (
    <h1 className="text-3xl sm:text-5xl text-white font-bold tracking-tight leading-tight mb-6">
      {/* Article (A / An) — animates smoothly so grammar stays correct */}
      <motion.span
        layout
        transition={{ layout: layoutSpring }}
        className="inline-block"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={article}
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: premiumEase }}
            className="inline-block"
          >
            {article}
          </motion.span>
        </AnimatePresence>
      </motion.span>{" "}
      {/* The cycling word */}
      <motion.span
        layout
        transition={{ layout: layoutSpring }}
        className="inline-block align-baseline"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={current}
            // Subtle scale (depth) and blur create a "focus/defocus" morph
            // instead of a harsh vertical slide. Minimal Y travel adds direction without bouncing.
            initial={{ opacity: 0, scale: 0.95, filter: "blur(12px)", y: 4 }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)", y: -4 }}
            transition={{ duration: 0.7, ease: premiumEase }}
            className="inline-block whitespace-nowrap bg-gradient-to-r from-[#0078D4] via-[#3aa8ff] to-cyan-300 bg-clip-text text-transparent pr-[0.04em]"
          >
            {current}
          </motion.span>
        </AnimatePresence>
      </motion.span>{" "}
      cloud storage
      <br />
      solution
    </h1>
  );
};

/* ── Hero — logged-out ── */
const LoggedOutHero = () => (
  <section className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
    <Reveal>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#222222] text-gray-100 mb-8">
        <LockKeyhole className="w-5 h-5 text-white" /> Secured by AWS Cloud
      </span>
    </Reveal>

    <Reveal delay={80}>
      <AnimatedHeadline />
    </Reveal>

    <Reveal delay={160}>
      <p className="text-base sm:text-lg leading-relaxed text-gray-200 max-w-xl mx-auto mb-10">
        A cloud storage platform stripped of the noise. No bloatware, no
        complicated settings, and zero compromises on your privacy.
      </p>
    </Reveal>

    <Reveal delay={240}>
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <PrimaryLink href="/verify-regis">
          Start for free <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryLink>
        <SecondaryLink href="/supported-formats">
          Supported Formats
        </SecondaryLink>
      </div>
    </Reveal>

    <Reveal delay={300}>
      <div className="flex flex-wrap items-center justify-center gap-6 font-semibold text-sm text-white">
        <span className="flex items-center gap-1.5">
          <p className="p-1 bg-blue-400 rounded-full">
            <Check className="w-5 h-5 text-black" />
          </p>
          No credit card
        </span>
        <span className="flex items-center gap-1.5">
          <p className="p-1 bg-blue-400 rounded-full">
            <Check className="w-5 h-5 text-black" />
          </p>{" "}
          Encrypted
        </span>
        <span className="flex items-center gap-1.5">
          <p className="p-1 bg-blue-400 rounded-full">
            <Check className="w-5 h-5 text-black" />
          </p>
          Zero AI training
        </span>
      </div>
    </Reveal>
  </section>
);

/* ── Preview section ── */
const PreviewSection = () => (
  <section className="max-w-5xl mx-auto px-6 pb-16">
    <Reveal>
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-full text-md font-medium bg-red-700 text-white mb-3">
          <span className="w-3 h-3 rounded-full bg-white animate-pulse" /> LIVE
          PREVIEW
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          See it in action.
        </h2>
        <p className="mt-1.5 text-sm text-gray-200">
          A dashboard that respects your time and your data.
        </p>
      </div>
    </Reveal>

    <Reveal delay={80}>
      <div className="rounded-4xl overflow-hidden shadow-lg">
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#232323]">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            ))}
          </div>
          <div className="flex-1 mx-3 px-3 py-1 rounded-full border border-[#444444] bg-[#1e1e1e] text-sm text-center text-yellow-200 truncate">
            kosha.cloudkinshuk.in/dashboard
          </div>
        </div>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-auto block aspect-video object-cover bg-gray-50"
        >
          <source src="/videos/brandy.mp4" type="video/mp4" />
        </video>
      </div>
    </Reveal>
  </section>
);

/* ── Features grid ── */
const FEATURES: Feature[] = [
  {
    id: "01",
    title: "5 GB Free Forever",
    body: "Generous AWS backed storage for everyone. Drop your files without worrying about space.",
    icon: HardDrive,
  },
  {
    id: "02",
    title: "Absolute Privacy",
    body: "Amazon S3 Encryption. We can't see your files or sell your habits.",
    icon: ShieldCheck,
  },
  {
    id: "03",
    title: "Zero Bloat",
    body: "No unnecessary features. A clean interface designed to get out of your way.",
    icon: Layout,
  },
  {
    id: "04",
    title: "Lightning Fast",
    body: "Optimized for speed. Uploads and downloads in the blink of an eye.",
    icon: Zap,
  },
  {
    id: "05",
    title: "No AI Training",
    body: "We do not use your data to train AI models. Your files are yours alone.",
    icon: BrainCircuit,
  },
  {
    id: "06",
    title: "No Bloated AI",
    body: "We do not offer any AI features. We focus on secure, private storage without distractions.",
    icon: BrickWallShield,
  },
  {
    id: "07",
    title: "Multiple Formats",
    body: "We support a wide range of file formats including documents, images, videos, and more.",
    icon: FileCog,
  },
  {
    id: "08",
    title: "You Control Your Data",
    body: "We do not collect any data about your files or usage. Full control over what you share.",
    icon: Cog,
  },
];

const FeaturesGrid = () => (
  <section
    id="features"
    className="max-w-6xl mx-auto px-6 py-20 border-t border-gray-100"
  >
    <Reveal>
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-white">
          Brilliantly simple.
        </h2>
        <p className="text-base text-gray-200">
          Everything you need. Nothing you don&apos;t.
        </p>
      </div>
    </Reveal>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-3xl border border-[#444444] overflow-hidden bg-[#1e1e1e]">
      {FEATURES.map((f, i) => {
        const Icon = f.icon;
        const cols = 4;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const lastRow = row === Math.ceil(FEATURES.length / cols) - 1;
        return (
          <Reveal key={f.id} delay={i * 40}>
            <div
              className="group h-full p-6 hover:bg-[#252525] transition-colors relative"
              style={{
                borderRight: col < cols - 1 ? "1px solid #444444" : "none",
                borderBottom: !lastRow ? "1px solid #444444" : "none",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-blue-800">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-300 font-mono">{f.id}</span>
              </div>
              <h3 className="text-sm font-semibold mb-1.5 text-white">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-200">{f.body}</p>
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                style={{ background: BLUE }}
              />
            </div>
          </Reveal>
        );
      })}
    </div>
  </section>
);

/* ── CTA ── */
const CTA = ({ isLoggedIn }: { isLoggedIn: boolean }) => (
  <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
    <Reveal>
      <div className="rounded-4xl border border-[#444444] bg-[#1e1e1e] p-8 sm:p-14">
        {isLoggedIn ? (
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white">
              Your files are waiting.
            </h2>
            <p className="text-base text-gray-200 mb-8">
              Jump back into your dashboard and keep your workflow going.
            </p>
            <PrimaryLink href="/dashboard">
              View Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </PrimaryLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white">
                Ready to take back your data?
              </h2>
              <p className="text-base text-gray-200 mb-8 max-w-lg">
                Join thousands who have migrated to a simpler, more secure way
                to store their digital life.
              </p>
              <div className="flex flex-wrap gap-3">
                <PrimaryLink href="/verify-regis">
                  Create Free Account <ArrowRight className="w-3.5 h-3.5" />
                </PrimaryLink>
                <SecondaryLink href="/supported-formats">
                  Learn more
                </SecondaryLink>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-4xl border border-[#444444] bg-[#121212] p-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-[#ff9100] mb-2">
                  Free plan
                </p>
                <div className="flex items-baseline gap-1.5 mb-5">
                  <span className="text-4xl font-bold text-white">Free</span>
                  <span className="text-md text-gray-300">/ forever</span>
                </div>
                <ul className="space-y-2.5 text-sm text-gray-200">
                  {[
                    "5 GB encrypted storage",
                    "Unlimited file types",
                    "Private by default",
                    "Fast downloads, anywhere",
                    "No AI training, ever",
                  ].map((x) => (
                    <li key={x} className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-white" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Reveal>
  </section>
);

/* ── Root ── */
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HomeContent />
    </Suspense>
  );
}

/* ── HomeContent — clerk auth + variant routing ── */
function HomeContent() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const isNewUser = useIsNewUser();

  const isLoggedIn = isLoaded && !!userId;
  const firstName = user?.firstName || "there";

  return (
    <div className="min-h-screen bg-black" style={{ color: INK }}>
      <main>
        <HeroGrid />

        {isLoggedIn && isNewUser ? (
          <NewUserHero firstName={firstName} />
        ) : isLoggedIn ? (
          <ReturningUserHero firstName={firstName} />
        ) : (
          <LoggedOutHero />
        )}

        {isLoaded && !userId && <PreviewSection />}
      </main>

      <FeaturesGrid />
      <CTA isLoggedIn={isLoggedIn} />
    </div>
  );
}
