import type { Metadata } from "next";
import { Playfair, Inter } from "next/font/google";
import "./globals.css";
import Nav from "./global-components/Nav";
import { TaskListProvider } from "./context/TasklistContext";
import { Toaster } from "sonner";
import { UserProvider } from "./context/UserContext";

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
      <body className={`${interFont.className} ${playfairFont.className}`}>
        <Toaster position="top-center" className="z-[200]" richColors={true} />
        <UserProvider>
          <TaskListProvider>
            <Nav />
            {children}
          </TaskListProvider>
        </UserProvider>
      </body>
    </html>
  );
}
