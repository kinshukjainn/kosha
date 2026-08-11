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
  "inline-flex w-fit items-center justify-center gap-2 py-2 px-4 font-semibold text-[14px] bg-white text-black rounded-full transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black";

export default function AboutUs() {
  const links = [
    {
      title: "Portfolio & Projects",
      description:
        "Explore my main website to see my latest work and creations.",
      href: "https://cloudkinshuk.in",
      icon: (
        <FaGlobe className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      ),
    },
    {
      title: "Read the Blog",
      description: "Thoughts, tutorials, and articles on tech and development.",
      href: "https://cloudkinshuk.in/home-blog",
      icon: (
        <FaPenNib className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      ),
    },
    {
      title: "Share Feedback",
      description: "Got ideas or found a bug? Let me know how I can improve.",
      href: "https://fdb.cloudkinshuk.in",
      icon: (
        <FaCommentDots className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      ),
    },
    {
      title: "Support My Work",
      description:
        "Buy me a brew or support the repository to keep servers running.",
      href: "https://brewrepo.cloudkinshuk.in",
      icon: (
        <FaMugHot className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      ),
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
    <div className="min-h-screen bg-black text-gray-300 py-16 px-4 sm:px-6 md:px-8 selection:bg-gray-800 selection:text-white ">
      <div className="max-w-3xl mx-auto space-y-16">
        {/* ================= PROJECT SECTION ================= */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Image
              src="/logog.png"
              alt="Kosha"
              width={48}
              height={48}
              className="rounded-md  object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Kosha
              </h1>
              <p className="text-sm text-gray-500  mt-1">
                Secure Personal Cloud Storage
              </p>
            </div>
          </div>

          <p className="text-base text-gray-200 leading-relaxed">
            Kosha is a secure, high-performance personal cloud storage platform
            designed to make your digital experience seamless and entirely under
            your control. Say goodbye to restrictive storage limits and hello to
            a private ecosystem built for your files, photos, and documents.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#141414]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <h3 className="text-sm font-semibold text-white">
                  Proudly Open Source
                </h3>
              </div>
              <p className="text-sm text-gray-300 max-w-md">
                Kosha is built with transparency in mind. Self-host, audit the
                code, and contribute to its continuous improvement.
              </p>
            </div>
            <a
              href="https://github.com/cloudkinshuk/kosha"
              target="_blank"
              rel="noopener noreferrer"
              className={primaryButtonClass}
            >
              <FaGithub className="w-4 h-4" />
              View Source
            </a>
          </div>
        </section>

        {/* ================= DEVELOPER SECTION ================= */}
        <section className="flex flex-col sm:flex-row gap-6 sm:gap-8 pt-8">
          <div className="flex-shrink-0">
            <Image
              src="/profile.jpg"
              alt="Kinshuk Jain"
              width={100}
              height={100}
              className="rounded-full border border-gray-800 object-cover"
              priority
            />
          </div>

          <div className="flex flex-col space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Kinshuk Jain
              </h2>
              <p className="text-sm text-gray-500  mt-1">
                Lead Developer & Creator
              </p>
            </div>

            <p className="text-base text-gray-400 leading-relaxed">
              I specialize in building robust tools, platforms, and web
              applications focused on great user experiences and modern
              architectures. When I am not coding, I am writing about tech,
              exploring new frameworks, or looking for ways to improve the
              digital tools we use every day.
            </p>

            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-blue-400  transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ================= RESOURCES & LINKS GRID ================= */}
        <section className="pt-8">
          <h3 className="text-lg font-bold text-white tracking-tight mb-6">
            More Resources
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-5 bg-[#141414]  transition-colors rounded-3xl h-full"
              >
                <div className="flex items-center gap-3 mb-3">
                  {link.icon}
                  <h4 className="text-sm font-semibold text-white group-hover:text-white transition-colors">
                    {link.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed mb-4 flex-1">
                  {link.description}
                </p>
                <div className="text-xs  font-medium text-blue-400 group-hover:text-white transition-colors mt-auto">
                  Visit Link &rarr;
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="pt-8 pb-4 text-center text-gray-600 text-xs  uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Kinshuk Jain. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
