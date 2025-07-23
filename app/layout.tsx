import type { Metadata } from "next";
import { Playfair, Inter } from "next/font/google";
import "./globals.css";
import Nav from "./global-components/Nav";
import { TaskListProvider } from "./context/TasklistContext";
import { Toaster } from "sonner";
import { UserProvider } from "./context/UserContext";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next"

export const playfairFont = Playfair({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
});

export const interFont = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nirvalla Tasks",
  description: "The personal open-source task management app.",
  keywords: ["task management", "task app", "task list", "task tracker"],
  openGraph: {
    title: "Nirvalla Tasks",
    description: "The personal open-source task management app.",
    type: "website",
    locale: "en",
    siteName: "Nirvalla Tasks",
    images: [
      {
        url: "/nirvalla-b&w-thick.svg",
        width: 1200,
        height: 630,
        alt: "Nirvalla Tasks",
      },
    ],
  },
  icons: {
    icon: "/nirvalla-b&w-thick.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interFont.className} ${playfairFont.className}`}>
        <Analytics />
        <Toaster position="top-center" className="z-[200]" richColors={true} />
        <UserProvider>
          <TaskListProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Nav />
              {children}
            </Suspense>
          </TaskListProvider>
        </UserProvider>
      </body>
    </html>
  );
}
