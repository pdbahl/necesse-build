import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Necesse Build Creator",
  description: "Create and share Necesse game builds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
