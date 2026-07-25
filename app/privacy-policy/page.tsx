"use client";

import React from "react";
import {
  Scale,
  Mail,
  ExternalLink,
  FileText,
  AlertTriangle,
} from "lucide-react";

const PLATFORM_NAME = "Kosha";
const PLATFORM_URL = "https://kosha.cloudkinshuk.in";
const SUPPORT_EMAIL = "kinshuk25jan04@gmail.com";
const COMPANY_NAME = "Kosha";
const EFFECTIVE_DATE = "April 15, 2026";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 selection:bg-[#0078D4] selection:text-white">
      {/* TOP NAVIGATION / BREADCRUMBS */}

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* LEFT SIDEBAR - TABLE OF CONTENTS (Desktop Only) */}
        <aside className="hidden lg:block w-[240px] shrink-0">
          <div className="sticky top-24">
            <h4 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-4">
              Contents
            </h4>
            <ul className="space-y-3 text-[14px]">
              <TocLink href="#agreement" text="Agreement to Terms" />
              <TocLink href="#the-service" text="1. The Service We Provide" />
              <TocLink href="#your-account" text="2. Your Account" />
              <TocLink
                href="#plans-limits"
                text="3. Storage Plans & Usage Limits"
              />
              <TocLink
                href="#acceptable-use"
                text="4. Acceptable Use & Content"
              />
              <TocLink
                href="#your-content"
                text="5. Your Content & Our License"
              />
              <TocLink href="#copyright" text="6. Copyright & Removal" />
              <TocLink
                href="#availability-backups"
                text="7. Availability & Backups"
              />
              <TocLink href="#termination" text="8. Termination" />
              <TocLink href="#disclaimers" text="9. Disclaimers" />
              <TocLink href="#liability" text="10. Limitation of Liability" />
              <TocLink href="#governing-law" text="11. Governing Law" />
              <TocLink href="#changes" text="12. Changes to These Terms" />
              <TocLink href="#contact" text="13. Contact Us" />
            </ul>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <article className="flex-1 max-w-3xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#0078D4]/10 rounded-2xl flex items-center justify-center border border-[#0078D4]/20">
                <Scale size={20} className="text-[#0078D4]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                Terms &amp; Conditions
              </h1>
            </div>
            <p className="text-[14px] text-gray-500">
              Last updated and effective as of{" "}
              <span className="text-gray-300">{EFFECTIVE_DATE}</span>
            </p>
          </div>

          <div className="space-y-12">
            {/* Introduction */}
            <section
              id="agreement"
              className="text-[15px] leading-relaxed text-gray-400"
            >
              <p>
                These Terms and Conditions (&quot;Terms&quot;) govern your
                access to and use of{" "}
                <strong className="font-medium text-gray-200">
                  {COMPANY_NAME}
                </strong>
                , accessible via{" "}
                <a
                  href={PLATFORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0078D4] hover:text-[#3399ff] hover:underline transition-colors inline-flex items-center gap-1"
                >
                  {PLATFORM_URL}
                  <ExternalLink size={12} />
                </a>
                , including our cloud storage platform and associated APIs.
              </p>
              <p className="mt-4">
                By creating an account or using the platform, you agree to be
                bound by these Terms and by our Privacy Policy, which describes
                what information we collect and how it is used. If you do not
                agree with these Terms, please discontinue use of the platform.
              </p>
            </section>

            {/* Mobile Contents (shown below lg breakpoint) */}
            <div className="lg:hidden bg-[#0a0a0c] border border-[#1f1f1f] rounded-2xl p-5">
              <h4 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-4">
                Contents
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[14px]">
                <TocLink href="#agreement" text="Agreement to Terms" />
                <TocLink href="#the-service" text="1. The Service" />
                <TocLink href="#your-account" text="2. Your Account" />
                <TocLink href="#plans-limits" text="3. Plans & Limits" />
                <TocLink href="#acceptable-use" text="4. Acceptable Use" />
                <TocLink href="#your-content" text="5. Your Content" />
                <TocLink href="#copyright" text="6. Copyright" />
                <TocLink href="#availability-backups" text="7. Backups" />
                <TocLink href="#termination" text="8. Termination" />
                <TocLink href="#disclaimers" text="9. Disclaimers" />
                <TocLink href="#liability" text="10. Liability" />
                <TocLink href="#governing-law" text="11. Governing Law" />
                <TocLink href="#changes" text="12. Changes" />
                <TocLink href="#contact" text="13. Contact" />
              </ul>
            </div>

            {/* Section 1 */}
            <section id="the-service" className="scroll-mt-24">
              <SectionHeading number="1" title="The Service We Provide" />
              <p className="text-[15px] text-gray-400 mb-4 leading-relaxed">
                {PLATFORM_NAME} is a cloud-based file storage platform. Files
                you upload are transferred directly to secure Amazon S3 storage
                using time-limited, cryptographically signed upload URLs — our
                application servers coordinate and authorize this process but do
                not route your file contents through them. Metadata about your
                files, such as size, type, and upload time, is recorded in our
                database to power listing, quota enforcement, and retrieval.
              </p>
              <p className="text-[15px] text-gray-400 leading-relaxed">
                We may update, expand, or discontinue individual features of the
                platform at our discretion. For changes that materially reduce
                functionality included in a paid plan, we will provide
                reasonable advance notice.
              </p>
            </section>

            {/* Section 2 */}
            <section id="your-account" className="scroll-mt-24">
              <SectionHeading number="2" title="Your Account" />
              <p className="text-[15px] text-gray-400 mb-6 leading-relaxed">
                Access to {PLATFORM_NAME} is provided through our authentication
                partner, Clerk. By registering for an account, you agree to the
                following:
              </p>
              <div className="pl-1 sm:pl-4 border-l border-[#1f1f1f]">
                <BulletList
                  items={[
                    "You will provide accurate registration information and keep it up to date.",
                    "You are responsible for safeguarding your credentials and for all activity that occurs under your account.",
                    "One account is intended for use by one individual; credential sharing is discouraged.",
                    "You must be at least 13 years old, or the minimum age of digital consent in your jurisdiction, to create an account.",
                  ]}
                />
              </div>
            </section>

            {/* Section 3 - Table */}
            <section id="plans-limits" className="scroll-mt-24">
              <SectionHeading number="3" title="Storage Plans & Usage Limits" />
              <p className="text-[15px] text-gray-400 mb-5 leading-relaxed">
                Every account is assigned a plan that defines three limits: a
                total storage allowance, a maximum number of files, and a
                maximum size per individual file. These limits are enforced
                automatically at the moment of upload — a request that would
                exceed any of the three is declined before the file is stored.
              </p>

              <div className="overflow-x-auto rounded-2xl border border-[#1f1f1f] bg-[#0a0a0c] mb-5">
                <table className="w-full text-left border-collapse min-w-[560px]">
                  <thead>
                    <tr className="border-b border-[#1f1f1f] bg-[#0f0f11]">
                      <th className="px-5 py-3.5 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-5 py-3.5 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
                        Storage Limit
                      </th>
                      <th className="px-5 py-3.5 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
                        File Count Limit
                      </th>
                      <th className="px-5 py-3.5 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
                        Max File Size
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f1f]">
                    <tr className="hover:bg-[#111113] transition-colors">
                      <td className="px-5 py-4 text-[14px] font-medium text-gray-200">
                        Free
                      </td>
                      <td className="px-5 py-4 text-[14px] text-gray-400">
                        [X GB]
                      </td>
                      <td className="px-5 py-4 text-[14px] text-gray-400">
                        [X files]
                      </td>
                      <td className="px-5 py-4 text-[14px] text-gray-400">
                        [X MB]
                      </td>
                    </tr>
                    <tr className="hover:bg-[#111113] transition-colors">
                      <td className="px-5 py-4 text-[14px] font-medium text-gray-200">
                        [Pro]
                      </td>
                      <td className="px-5 py-4 text-[14px] text-gray-400">
                        [X GB]
                      </td>
                      <td className="px-5 py-4 text-[14px] text-gray-400">
                        [X files]
                      </td>
                      <td className="px-5 py-4 text-[14px] text-gray-400">
                        [X MB]
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[13.5px] text-gray-500 leading-relaxed">
                Exact current limits for each plan are shown in your account
                dashboard. We may adjust plan limits going forward; reductions
                to an existing paid plan will come with reasonable notice.
              </p>
            </section>

            {/* Section 4 */}
            <section id="acceptable-use" className="scroll-mt-24">
              <SectionHeading
                number="4"
                title="Acceptable Use & Content Restrictions"
              />
              <p className="text-[15px] text-gray-400 mb-4 leading-relaxed">
                {PLATFORM_NAME} accepts common file formats — images, documents,
                spreadsheets, presentations, archives, audio, and video among
                others. To protect all users, we do not accept{" "}
                <strong className="font-medium text-gray-200">
                  HTML or SVG files
                </strong>
                , since both formats can embed executable code that would run if
                the file were later viewed or shared.
              </p>
              <p className="text-[15px] text-gray-400 mb-4 leading-relaxed">
                Beyond file type, you agree not to use {PLATFORM_NAME} to:
              </p>
              <div className="pl-1 sm:pl-4 border-l border-[#1f1f1f]">
                <BulletList
                  items={[
                    "Store or distribute content that is unlawful, or whose possession is itself unlawful in your jurisdiction.",
                    "Upload malware, exploits, or any file intended to damage or gain unauthorized access to a system.",
                    "Store content that infringes the intellectual property or other rights of a third party.",
                    "Attempt to bypass storage quotas, rate limits, or authentication and access controls.",
                    "Send automated requests at a volume intended to disrupt service stability for other users.",
                  ]}
                />
              </div>
            </section>

            {/* Section 5 */}
            <section id="your-content" className="scroll-mt-24">
              <SectionHeading number="5" title="Your Content & Our License" />
              <p className="text-[15px] text-gray-400 mb-4 leading-relaxed">
                You retain all ownership rights to the files you upload. We
                claim no intellectual property rights over your content. By
                uploading a file, you grant {COMPANY_NAME} a limited,
                non-exclusive license to store, reproduce, and transmit that
                file solely for the purpose of operating the platform for you —
                for example, generating a signed link so you can download it.
              </p>
              <p className="text-[15px] text-gray-400 leading-relaxed">
                We do not use your content for advertising, model training, or
                any purpose beyond providing the service back to you. You remain
                responsible for ensuring you hold the necessary rights to any
                content you upload.
              </p>
            </section>

            {/* Section 6 */}
            <section id="copyright" className="scroll-mt-24">
              <SectionHeading number="6" title="Copyright & Content Removal" />
              <p className="text-[15px] text-gray-400 mb-5 leading-relaxed">
                If we receive a valid legal notice — a copyright complaint, a
                court order, or a credible report of unlawful content — we may
                remove or disable access to the file identified, and will notify
                the affected account holder where legally permitted. Accounts
                responsible for repeated or serious violations may be suspended
                or terminated under Section 8.
              </p>
              <Callout icon={FileText} title="On content access:">
                {PLATFORM_NAME} stores files as uploaded, without end-to-end
                encryption. This means our infrastructure has the technical
                capacity to access stored files where necessary to operate the
                service, respond to valid legal process, or investigate a
                reported abuse. Such access is limited to those purposes and
                governed by our Privacy Policy — we do not browse, inspect, or
                share your files otherwise.
              </Callout>
            </section>

            {/* Section 7 */}
            <section id="availability-backups" className="scroll-mt-24">
              <SectionHeading
                number="7"
                title="Availability, Backups & Data Loss"
              />
              <p className="text-[15px] text-gray-400 mb-5 leading-relaxed">
                We aim to keep {PLATFORM_NAME} available and reliable, but the
                platform is provided on a best-effort basis and we do not
                guarantee uninterrupted or error-free operation.
              </p>
              <Callout icon={AlertTriangle} title="Keep your own backups:">
                {PLATFORM_NAME} is a storage and sync convenience, not a
                substitute for independent backups. We strongly recommend
                keeping an independent copy of any file that is critical or
                irreplaceable to you. {COMPANY_NAME} is not liable for data loss
                arising from technical failure, account termination, or any
                other cause described in these Terms.
              </Callout>
            </section>

            {/* Section 8 */}
            <section id="termination" className="scroll-mt-24">
              <SectionHeading number="8" title="Termination" />
              <p className="text-[15px] text-gray-400 mb-4 leading-relaxed">
                You may delete your account at any time from account settings.
                Deletion removes your account record and all associated files
                from our active storage and database.
              </p>
              <p className="text-[15px] text-gray-400 leading-relaxed">
                We may suspend or terminate an account for a material violation
                of these Terms, unlawful use, or conduct that puts the platform
                or other users at risk, with notice where practicable. Sections
                4, 5, 6, 9, 10, and 11 survive termination of your account.
              </p>
            </section>

            {/* Section 9 */}
            <section id="disclaimers" className="scroll-mt-24">
              <SectionHeading number="9" title="Disclaimers" />
              <div className="bg-[#0a0a0c] border border-[#1f1f1f] rounded-2xl p-4 sm:p-5 flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                <p className="text-[13.5px] text-gray-400 leading-relaxed">
                  <strong className="text-gray-200 font-medium">
                    Provided &quot;as is&quot;:
                  </strong>{" "}
                  {PLATFORM_NAME} is provided without warranties of any kind,
                  express or implied, including merchantability, fitness for a
                  particular purpose, and uninterrupted or error-free operation.
                  While we use commercially reasonable security measures, no
                  method of electronic storage or transmission is 100% secure,
                  and we cannot guarantee absolute protection against loss or
                  unauthorized access.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="liability" className="scroll-mt-24">
              <SectionHeading number="10" title="Limitation of Liability" />
              <p className="text-[15px] text-gray-400 leading-relaxed">
                To the maximum extent permitted by law, {COMPANY_NAME} is not
                liable for indirect, incidental, special, consequential, or
                punitive damages, or for lost profits or lost data. Our total
                aggregate liability for any claim relating to the platform is
                limited to the greater of the amount you paid us in the 12
                months preceding the claim, or{" "}
                <strong className="font-medium text-gray-200">[50 USD]</strong>.
                Nothing in this section limits liability that cannot be limited
                under applicable law.
              </p>
            </section>

            {/* Section 11 */}
            <section id="governing-law" className="scroll-mt-24">
              <SectionHeading number="11" title="Governing Law" />
              <p className="text-[15px] text-gray-400 leading-relaxed">
                These Terms are governed by the laws of{" "}
                <strong className="font-medium text-gray-200">
                  [your country or state]
                </strong>
                , without regard to conflict-of-law principles. Any dispute that
                cannot be resolved informally will be brought in the courts of{" "}
                <strong className="font-medium text-gray-200">
                  [your venue]
                </strong>
                , except where local law grants you the right to bring claims in
                your own jurisdiction.
              </p>
            </section>

            {/* Section 12 */}
            <section id="changes" className="scroll-mt-24">
              <SectionHeading number="12" title="Changes to These Terms" />
              <p className="text-[15px] text-gray-400 leading-relaxed">
                If these Terms change, we will update the effective date at the
                top of this page. For material changes, we will notify you in
                the app or by email before they take effect. Continuing to use{" "}
                {PLATFORM_NAME} after a change takes effect constitutes
                acceptance of the updated Terms.
              </p>
            </section>

            {/* Section 13 - Contact */}
            <section id="contact" className="scroll-mt-24">
              <SectionHeading number="13" title="Contact Us" />
              <div className="bg-gradient-to-br from-[#0a0a0c] to-[#050505] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 mt-4 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0078D4]/5 rounded-2xl blur-3xl" />

                <p className="text-[15px] text-gray-400 mb-6 relative z-10">
                  Questions about these Terms are welcome. Reach our team
                  directly:
                </p>
                <div className="space-y-2 relative z-10">
                  <p className="font-semibold text-[16px] text-gray-200">
                    {COMPANY_NAME} Legal
                  </p>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="inline-flex items-center gap-2 text-[14px] font-medium text-[#0078D4] hover:text-[#3399ff] transition-colors"
                  >
                    <Mail size={16} />
                    {SUPPORT_EMAIL}
                  </a>
                </div>
              </div>
            </section>
          </div>
        </article>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#1f1f1f] mt-12 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-[13px] text-gray-600">
          © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* ============================================================================
 * Utilities
 * ============================================================================ */

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="text-[20px] font-semibold text-gray-100 mb-4 flex items-center gap-3">
      <span className="text-[#0078D4] font-mono text-[16px] bg-[#0078D4]/10 w-8 h-8 rounded-2xl flex items-center justify-center border border-[#0078D4]/20">
        {number}
      </span>
      {title}
    </h2>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-gray-400 text-[14.5px]">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 items-start group">
          <span className="text-[#333] group-hover:text-[#0078D4] transition-colors mt-[6px] shrink-0 text-[10px]">
            ◆
          </span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Callout({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0a0a0c] border border-[#1f1f1f] rounded-2xl p-4 sm:p-5 flex gap-3 items-start">
      <Icon className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
      <p className="text-[13.5px] text-gray-400 leading-relaxed">
        <strong className="text-gray-200 font-medium">{title}</strong>{" "}
        {children}
      </p>
    </div>
  );
}

function TocLink({ href, text }: { href: string; text: string }) {
  return (
    <li>
      <a
        href={href}
        className="text-gray-500 hover:text-[#0078D4] transition-colors block py-1"
      >
        {text}
      </a>
    </li>
  );
}
