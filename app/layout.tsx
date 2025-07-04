import type { Metadata } from "next";
import { Playfair, Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import { TaskListProvider } from "./context/tasklist-context";

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
  description: "The modern task management app",
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
      <body>
        <TaskListProvider>
          <Nav />
          {children}
        </TaskListProvider>
      </body>
    </html>
  );
}
