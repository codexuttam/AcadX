import type { Metadata } from "next";
import { Quicksand, Inter } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-quicksand" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AcadX — Academic Doubt Resolution Platform",
  description: "X-like doubt resolution platform for engineering students. Post questions, get answers from professors, filter by subject.",
  keywords: ["AcadX", "academic doubts", "engineering", "CSE", "AIML", "professors"],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>

  );
}
