import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./component/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agu AI — Ututu Digital Intelligence Kernel",
  description:
    "The sovereign digital storyteller and AI history keeper for the historic Ututu Ancient Kingdom in Arochukwu LGA, Abia State, Nigeria.",
  keywords: [
    "Agu AI",
    "Ututu Kingdom",
    "Ututu History",
    "Arochukwu LGA",
    "Abia State",
    "Igbo Heritage AI",
  ],
  icons: {
    icon: "/logo1.png",
    apple: "/logo1.png",
  },
  openGraph: {
    title: "Agu AI — Ututu Digital Intelligence Kernel",
    description:
      "Explore the history, governance, villages, and culture of Ututu Kingdom through Agu AI.",
    images: [{ url: "/logo1.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
