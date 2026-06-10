"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
const pricingTiers = [
  {
    name: "Free",
    price: "₹0",
    description: "Perfect for personal use to get started.",
    features: [
      "2 GB Encrypted Storage (S3 Encryption)",
      "Standard File Sharing",
      "File Versioning (Up to 30 Days)",
      "Community Support",
    ],
    buttonText: "Free Plan",
    buttonHref: "/dashboard",
    isPopular: false,
    theme: {
      cardBg: "bg-zinc-900",
      border: "border-zinc-800 hover:border-zinc-600",
      title: "text-zinc-100",
      icon: "text-zinc-500",
      price: "text-zinc-100",
      button:
        "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700",
      badgeBg: "",
      badgeText: "",
    },
  },
  {
    name: "Gold",
    price: "₹299",
    billingPeriod: "/mo",
    description: "For heavy users who need maximum security and space.",
    features: [
      "2 TB Encrypted Storage",
      "Advanced Sharing Links",
      "Public links (Up to 1 week)",
      "Supports 3 devices max",
      "S3 Encryption + AWS KMS",
      "File Recovery (Up to 30 days)",
      "Average Speeds",
    ],
    buttonText: "Upgrade to Gold",
    buttonHref: "/checkout",
    isPopular: true,
    theme: {
      cardBg: "bg-zinc-900",
      border: "border-zinc-800 hover:border-amber-500/50",
      title: "text-amber-500",
      icon: "text-amber-500",
      price: "text-amber-500",
      button:
        "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/50",
      badgeBg: "bg-amber-500",
      badgeText: "text-zinc-950",
    },
  },
  {
    name: "Platinum",
    price: "₹399",
    billingPeriod: "/mo",
    description: "For ultimate power users needing bulky cloud backups.",
    features: [
      "8 TB Encrypted Storage",
      "Advanced Sharing Links",
      "Public links (Up to 2 weeks)",
      "Supports 5 devices max",
      "S3 Encryption + Client Side",
      "File Recovery (Up to 45 days)",
      "Fastest Speeds",
    ],
    buttonText: "Upgrade to Platinum",
    buttonHref: "/checkout",
    isPopular: false,
    theme: {
      cardBg: "bg-zinc-900",
      border: "border-zinc-800 hover:border-cyan-500/50",
      title: "text-cyan-500",
      icon: "text-cyan-500",
      price: "text-cyan-500",
      button:
        "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 border border-cyan-500/50",
      badgeBg: "bg-cyan-500",
      badgeText: "text-zinc-950",
    },
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "tween", ease: "easeOut", duration: 0.4 },
  },
};

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-300 flex items-center justify-center p-4 md:p-8  selection:bg-zinc-800 selection:text-white">
      <div className="relative z-10 w-full max-w-6xl mx-auto py-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <div className="  shadow-sm">
              <Image
                src="/premiumlogo.png"
                alt="Kosha"
                width={130}
                height={130}
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4 tracking-tight">
            Simple Pricing.
          </h1>
          <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Secure your digital life with Kosha. Choose the plan that best fits
            your storage and privacy needs. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={`relative flex flex-col p-8 rounded-lg transition-colors duration-200 shadow-xl ${tier.theme.cardBg} border ${tier.theme.border}`}
            >
              {/* Popular Badge */}
              {tier.isPopular && (
                <div
                  className={`absolute -top-3 right-6 ${tier.theme.badgeBg} ${tier.theme.badgeText} text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider shadow-sm`}
                >
                  Most Popular
                </div>
              )}

              {/* Card Header */}
              <div className="mb-6 border-b border-zinc-800 pb-6">
                <h2
                  className={`text-sm  uppercase tracking-wider font-bold mb-4 ${tier.theme.title}`}
                >
                  [{tier.name}]
                </h2>
                <div className="flex items-end gap-1 mb-3">
                  <span
                    className={`text-4xl font-bold leading-none tracking-tight  ${tier.theme.price}`}
                  >
                    {tier.price}
                  </span>
                  {tier.billingPeriod && (
                    <span className="text-zinc-500 text-sm font-medium mb-1 ">
                      {tier.billingPeriod}
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed min-h-[40px]">
                  {tier.description}
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8 flex-grow">
                {tier.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-zinc-300"
                  >
                    <Check
                      size={18}
                      strokeWidth={3}
                      className={`shrink-0 mt-0.5 ${tier.theme.icon}`}
                    />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div className="mt-auto pt-6">
                <Link
                  href={tier.buttonHref}
                  className="w-full block outline-none"
                  tabIndex={-1}
                >
                  <button
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 font-bold text-sm rounded-md transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#09090b] focus:ring-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed ${tier.theme.button}`}
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
