import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trial - For New Users",
  description:
    "This trial version is designed to make the expiernce the user for the most efficient thing",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={` antialiased`}>{children}</section>;
}
