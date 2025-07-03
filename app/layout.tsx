import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nirvalla Tasks",
  description: "The modern task management app",
  icons: {
    icon: "/nirvalla-b&w.svg",
  },
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
