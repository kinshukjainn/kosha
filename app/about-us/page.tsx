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
import { BsCloudRain } from "react-icons/bs";

const primaryButtonClass =
  "inline-flex w-fit items-center justify-center gap-2 py-2 px-5 font-semibold text-[15px] bg-blue-800 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0078D4]";

export default function AboutUs() {
  const links = [
    {
      title: "Portfolio & Projects",
      description:
        "Explore my main website to see my latest work and creations.",
      href: "https://cloudkinshuk.in",
      icon: <FaGlobe className="w-6 h-6 text-white" />,
    },
    {
      title: "Read the Blog",
      description: "Thoughts, tutorials, and articles on tech and development.",
      href: "https://cloudkinshuk.in/home-blog",
      icon: <FaPenNib className="w-6 h-6 text-white" />, // Microsoft green
    },
    {
      title: "Share Feedback",
      description: "Got ideas or found a bug? Let me know how I can improve.",
      href: "https://fdb.cloudkinshuk.in",
      icon: <FaCommentDots className="w-6 h-6 text-white" />, // Microsoft purple
    },
    {
      title: "Support My Work",
      description:
        "Buy me a brew or support the repository to keep servers running.",
      href: "https://brewrepo.cloudkinshuk.in",
      icon: <FaMugHot className="w-6 h-6 text-white" />, // Microsoft rust/orange
    },
  ];

  const socialLinks = [
    {
      icon: <FaGithub className="w-4 h-4" />,
      href: "https://github.com/cloudkinshuk",
      label: "GitHub",
    },
    {
      icon: <FaTwitter className="w-4 h-4" />,
      href: "https://x.com/realkinshuk004",
      label: "Twitter",
    },
    {
      icon: <FaInstagram className="w-4 h-4" />,
      href: "https://instagram.com/kinshukjainn",
      label: "Instagram",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100 py-10 px-4 md:px-8  selection:bg-[#cce3f5]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ================= PROJECT SECTION ================= */}
        <section className="bg-[#1e1e1e] border border-[#444444] p-6 md:p-8 shadow-sm rounded-3xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="p-2 bg-blue-800 rounded-full flex shrink-0 items-center justify-center">
              <BsCloudRain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-[28px] md:text-[24px] font-semibold text-gray-100 tracking-tight leading-tight">
                About Kosha
              </h1>
              <p className="text-[13px] text-blue-300 font-medium mt-0.5">
                Secure Personal Cloud Storage
              </p>
            </div>
          </div>

          <p className="text-[14px] text-gray-200 leading-relaxed mb-6">
            Kosha is a secure, high-performance personal cloud storage platform
            designed to make your digital experience seamless and entirely under
            your control. Say goodbye to restrictive storage limits and hello to
            a private ecosystem built for your files, photos, and documents.
          </p>

          <div className=" border border-[#444444] p-5 rounded-2xl">
            <p className="text-[13px] text-gray-100 mb-4 leading-relaxed">
              <strong className="text-blue-300 font-semibold">
                Proudly Open Source
              </strong>{" "}
              — Kosha is built with transparency in mind. The core project is
              open-source, meaning developers can self-host, audit the code, and
              contribute to its continuous improvement.
            </p>
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
        <section className="flex flex-col md:flex-row gap-6 md:gap-8 items-start bg-[#1e1e1e] border border-[#444444] p-6 md:p-8 shadow-sm rounded-3xl">
          {/* Avatar (Azure square/rounded profile style) */}
          <div className="flex-shrink-0 relative w-24 h-24 md:w-32 md:h-32  shadow-sm rounded-full overflow-hidden">
            <Image
              src="/profile.jpg" // Replace with your actual image path
              alt="Kinshuk Jain Avatar"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 96px, 128px"
              priority
            />
          </div>

          {/* Bio & Socials */}
          <div className="space-y-4 w-full">
            <div>
              <h2 className="text-[29px] md:text-[22px] font-semibold text-gray-100 tracking-tight leading-tight">
                Hi, I am Kinshuk Jain
              </h2>
              <p className="text-[13px] text-blue-300 font-medium mt-0.5">
                Lead Developer & Creator
              </p>
            </div>

            <div className="border-t border-gray-100 w-full"></div>

            <p className="text-[14px] text-gray-200 leading-relaxed">
              I am the lead developer and creator behind Kosha. I specialize in
              building robust tools, platforms, and web applications focused on
              great user experiences and modern architectures. When I am not
              coding, I am writing about tech, exploring new frameworks, or
              looking for ways to improve the digital tools we use every day.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2 pt-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center w-9 h-9 bg-black text-gray-100 rounded-full transition-colors "
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ================= RESOURCES & LINKS GRID ================= */}
        <section>
          <div className="flex items-center gap-4 mb-5 mt-8">
            <h3 className="text-[24px] md:text-[20px] font-semibold text-gray-100 tracking-tight">
              More Resources
            </h3>
            <div className="flex-1 border-t-2 border-blue-300 mt-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-6 bg-[#1e1e1e] border border-[#444444] shadow-sm hover:shadow-md transition-shadow rounded-2xl"
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="p-2.5 bg-blue-800 rounded-full text-white transition-colors">
                    {link.icon}
                  </div>
                  <h4 className="text-[15px] font-semibold text-gray-100  transition-colors">
                    {link.title}
                  </h4>
                </div>

                <p className="text-gray-200 text-[15px] leading-relaxed mb-4 flex-1">
                  {link.description}
                </p>

                <div className="mt-auto flex items-center text-[13px] font-medium text-blue-300 group-hover:underline">
                  Visit Link &rarr;
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <div className="pt-10 pb-4 text-center text-gray-500 text-[12px]">
          <p>
            COPYRIGHT © {new Date().getFullYear()} KINSHUK JAIN. ALL RIGHTS
            RESERVED.
          </p>
        </div>
      </div>
    </div>
  );
}
