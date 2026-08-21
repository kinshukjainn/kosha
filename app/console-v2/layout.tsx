import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trial Console - Trials Personal Cloud Storage",
  description:
    "Welcome to your personal cloud storage dashboard. Here you can manage your files, view storage usage, and access various features to keep your data organized and secure.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={` antialiased`}>{children}</section>;
}
