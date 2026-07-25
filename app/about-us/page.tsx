"use client";
import Image from "next/image";
import {
  FaGlobe,
  FaPenNib,
  FaCommentDots,
  FaMugHot,
  FaGithub,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

const primaryButtonClass =
  "inline-flex w-fit items-center justify-center gap-2 py-2.5 px-6 font-semibold text-[14px] bg-white text-black rounded-2xl transition-all duration-300 hover:bg-gray-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#161923] focus:ring-white";

export default function AboutUs() {
  const links = [
    {
      title: "Portfolio & Projects",
      description:
        "Explore my main website to see my latest work and creations.",
      href: "https://cloudkinshuk.in",
      icon: <FaGlobe className="w-6 h-6 text-blue-400" />,
    },
    {
      title: "Read the Blog",
      description: "Thoughts, tutorials, and articles on tech and development.",
      href: "https://cloudkinshuk.in/home-blog",
      icon: <FaPenNib className="w-6 h-6 text-green-400" />,
    },
    {
      title: "Share Feedback",
      description: "Got ideas or found a bug? Let me know how I can improve.",
      href: "https://fdb.cloudkinshuk.in",
      icon: <FaCommentDots className="w-6 h-6 text-purple-400" />,
    },
    {
      title: "Support My Work",
      description:
        "Buy me a brew or support the repository to keep servers running.",
      href: "https://brewrepo.cloudkinshuk.in",
      icon: <FaMugHot className="w-6 h-6 text-orange-400" />,
    },
  ];

  const socialLinks = [
    {
      icon: <FaGithub className="w-5 h-5" />,
      href: "https://github.com/cloudkinshuk",
      label: "GitHub",
    },
    {
      icon: <FaTwitter className="w-5 h-5" />,
      href: "https://x.com/realkinshuk004",
      label: "Twitter",
    },
    {
      icon: <FaInstagram className="w-5 h-5" />,
      href: "https://instagram.com/kinshukjainn",
      label: "Instagram",
    },
  ];

  return (
    <div className="min-h-screen bg-[#161923] text-gray-100 py-12 px-4 md:px-8 selection:bg-blue-500/30 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ================= PROJECT SECTION ================= */}
        <section className="relative p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8">
            <div className="p-1.5 bg-gradient-to-br from-gray-800 to-black rounded-2xl border border-white/10 shadow-lg flex shrink-0 items-center justify-center">
              <Image
                src="/logog.png"
                alt="Kosha"
                width={42}
                height={42}
                className="rounded-2xl object-cover"
              />
            </div>
            <div>
              <h1 className="text-[28px] md:text-[32px] font-bold text-white tracking-tight leading-tight">
                About Kosha
              </h1>
              <p className="text-[14px] text-blue-400 font-medium mt-1 tracking-wide uppercase">
                Secure Personal Cloud Storage
              </p>
            </div>
          </div>

          <p className="relative z-10 text-[15px] md:text-[16px] text-gray-300 leading-relaxed mb-8 max-w-3xl">
            Kosha is a secure, high-performance personal cloud storage platform
            designed to make your digital experience seamless and entirely under
            your control. Say goodbye to restrictive storage limits and hello to
            a private ecosystem built for your files, photos, and documents.
          </p>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/20 p-6 rounded-2xl">
            <div className="max-w-lg">
              <h3 className="text-green-400 font-semibold mb-2 flex items-center gap-2 text-[15px]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                Proudly Open Source
              </h3>
              <p className="text-[14px] text-gray-400 leading-relaxed">
                Kosha is built with transparency in mind. The core project is
                open-source, meaning developers can self-host, audit the code,
                and contribute to its continuous improvement.
              </p>
            </div>
            <a
              href="https://github.com/cloudkinshuk/kosha"
              target="_blank"
              rel="noopener noreferrer"
              className={primaryButtonClass}
            >
              <FaGithub className="w-[18px] h-[18px]" />
              View Source on GitHub
            </a>
          </div>
        </section>

        {/* ================= DEVELOPER SECTION ================= */}
        <section className="relative flex flex-col md:flex-row gap-8 items-center md:items-start p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm shadow-xl">
          {/* Avatar */}
          <div className="flex-shrink-0 relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-[#161923] outline outline-1 outline-white/10 shadow-2xl">
            <Image
              src="/profile.jpg"
              alt="Kinshuk Jain Avatar"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 112px, 144px"
              priority
            />
          </div>

          {/* Bio & Socials */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-5 w-full">
            <div className="space-y-3">
              <h2 className="text-[26px] md:text-[30px] font-bold text-white tracking-tight leading-tight">
                Hi, I am Kinshuk Jain
              </h2>
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[13px] font-mono font-medium">
                Lead Developer & Creator
              </div>
            </div>

            <p className="text-[15px] text-gray-300 leading-relaxed max-w-2xl">
              I am the lead developer and creator behind Kosha. I specialize in
              building robust tools, platforms, and web applications focused on
              great user experiences and modern architectures. When I am not
              coding, I am writing about tech, exploring new frameworks, or
              looking for ways to improve the digital tools we use every day.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center w-12 h-12 bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-white/20 text-gray-400 hover:text-white rounded-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ================= RESOURCES & LINKS GRID ================= */}
        <section className="pt-4">
          <div className="flex items-center gap-6 mb-8">
            <h3 className="text-[20px] font-semibold text-white tracking-tight whitespace-nowrap">
              More Resources
            </h3>
            <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-6 bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 rounded-2xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                    {link.icon}
                  </div>
                  <h4 className="text-[16px] font-semibold text-gray-100 group-hover:text-white transition-colors">
                    {link.title}
                  </h4>
                </div>

                <p className="text-gray-400 text-[14px] leading-relaxed mb-6 flex-1">
                  {link.description}
                </p>

                <div className="mt-auto flex items-center text-[13px] font-medium text-blue-400 group-hover:text-blue-300 group-hover:translate-x-1 transition-all duration-300">
                  Visit Link <span className="ml-2">&rarr;</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <div className="pt-12 pb-6 text-center text-gray-500 text-[12px] font-medium tracking-wide">
          <p>
            COPYRIGHT © {new Date().getFullYear()} KINSHUK JAIN. ALL RIGHTS
            RESERVED.
          </p>
        </div>
      </div>
    </div>
  );
}
