"use client";

import { Check, Sparkles } from "lucide-react";
import { IoDiamondOutline } from "react-icons/io5";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import HeroGrid from "../components/HeroGrid";

const pricingTiers = [
  {
    name: "Free",
    price: "₹0",
    description: "Perfect for personal use to get started.",
    features: [
      "2 GB Encrypted Storage (S3 Encryption On Transit and At Rest)",
      "Standard File Sharing",
      "File Versioning (Up to 30 Days)",
      "Community Support",
    ],
    buttonText: "Free Plan",
    buttonHref: "/dashboard",
    isPopular: false,
    theme: {
      cardBg: "bg-white/5",
      glassGradient: "from-white/10 to-transparent",
      border: "border-white/10",
      borderHighlight: "border-t-white/20 border-l-white/10",
      title: "text-gray-200",
      icon: "text-gray-400",
      button: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
      badgeBg: "",
      badgeText: "",
    },
  },
  {
    name: "Gold",
    price: "₹299",
    billingPeriod: "/Month",
    description:
      "For heavy users who need maximum security, space, and customizations.",
    features: [
      "2 TB Encrypted Storage",
      "Advanced Sharing Links (Passwords & Expiration)",
      "Public links with longer expiration (Up to 1 week)",
      "Supports 3 devices max per account",
      "S3 Encryption with AWS KMS Support",
      "File Versioning & Recovery (Up to 30 days)",
      "Average Upload and Download Speeds",
    ],
    buttonText: "Upgrade to Gold",
    buttonHref: "/checkout",
    isPopular: true,
    theme: {
      cardBg: "bg-amber-500/5",
      glassGradient: "from-amber-500/10 to-transparent",
      border: "border-amber-500/20",
      borderHighlight: "border-t-amber-300/30 border-l-amber-300/20",
      title: "text-amber-300",
      icon: "text-amber-400",
      button:
        "bg-amber-500/10 hover:bg-amber-500/20 text-amber-100 border border-amber-500/30",
      badgeBg: "bg-amber-500/10 border border-amber-500/30",
      badgeText: "text-amber-300",
    },
  },
  {
    name: "Platinum",
    price: "₹399",
    billingPeriod: "/Month",
    description:
      "For the ultimate power users who want bulky data backups on cloud.",
    features: [
      "8 TB Encrypted Storage",
      "Advanced Sharing Links (Passwords & Expiration)",
      "Public links with longer expiration (Up to 2 weeks)",
      "Supports 5 devices max per account",
      "S3 Encryption with AWS KMS Support + client side encryption",
      "File Versioning & Recovery (Up to 45 days)",
      "Fastest Upload and Download Speeds",
    ],
    buttonText: "Upgrade to Platinum",
    buttonHref: "/checkout",
    isPopular: true,
    theme: {
      cardBg: "bg-cyan-500/5",
      glassGradient: "from-cyan-400/10 to-transparent",
      border: "border-cyan-400/20",
      borderHighlight: "border-t-cyan-300/30 border-l-cyan-300/20",
      title: "text-cyan-300",
      icon: "text-cyan-400",
      button:
        "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-100 border border-cyan-400/30",
      badgeBg: "bg-cyan-500/10 border border-cyan-400/30",
      badgeText: "text-cyan-300",
    },
  },
];

// Subtle, smooth animations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "tween", ease: "easeOut", duration: 0.5 },
  },
};

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-black text-gray-100 flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Background Grid - Absolutely positioned behind content */}
      <div className="absolute inset-0 z-0 opacity-60">
        <HeroGrid />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto py-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <div className="p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
              <IoDiamondOutline size={48} className="text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-semibold title-font  text-white mb-4 tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
            Secure your digital life with Kosha. Choose the plan that best fits
            your storage and privacy needs.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={`relative flex flex-col p-8 rounded-[2rem] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${tier.theme.cardBg} bg-gradient-to-b ${tier.theme.glassGradient} border-y ${tier.theme.border} ${tier.theme.borderHighlight}`}
            >
              {/* Popular Badge */}
              {tier.isPopular && (
                <div
                  className={`absolute -top-4 right-6 ${tier.theme.badgeBg} ${tier.theme.badgeText} backdrop-blur-md text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-none`}
                >
                  <Sparkles size={14} />
                  Most Popular
                </div>
              )}

              {/* Card Header */}
              <div className="mb-6 border-b border-white/5 pb-6">
                <h2 className={`text-lg font-medium mb-3 ${tier.theme.title}`}>
                  {tier.name}
                </h2>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-4xl font-semibold title-font text-white leading-none tracking-tight">
                    {tier.price}
                  </span>
                  {tier.billingPeriod && (
                    <span className="text-gray-400 text-sm font-medium mb-1">
                      {tier.billingPeriod}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed min-h-[40px]">
                  {tier.description}
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8 flex-grow">
                {tier.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-300"
                  >
                    <Check
                      size={18}
                      strokeWidth={2.5}
                      className={`shrink-0 mt-0.5 ${tier.theme.icon}`}
                    />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div className="mt-auto pt-6 border-t border-white/5">
                <Link
                  href={tier.buttonHref}
                  className="w-full block outline-none"
                  tabIndex={-1}
                >
                  <button
                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 font-medium text-base rounded-2xl transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed ${tier.theme.button}`}
                  >
                    {tier.buttonText}
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
