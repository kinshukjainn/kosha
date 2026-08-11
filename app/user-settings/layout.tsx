import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Settings - Personal Cloud Storage",
  description: "Edit your personal details",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={` antialiased`}>{children}</section>;
}
