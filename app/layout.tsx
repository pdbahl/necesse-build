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
      <body className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>

        <footer className="py-4 text-center text-sm text-gray-300 bg-gradient-to-t from-gray-900/60 to-transparent border-t border-gray-700">
          <span className="text-gray-400">Created by&nbsp;</span>
          <a
            href="https://www.youtube.com/@menloo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-semibold hover:underline"
          >
            Menlo
          </a>
        </footer>
      </body>
    </html>
  );
}
