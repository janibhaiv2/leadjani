import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "CULTJANI - Lead Management System",
    template: "%s | CULTJANI"
  },
  description: "CULTJANI is a powerful lead management system for processing, filtering, and distributing Meta/Facebook Lead Form data",
  keywords: ["lead management", "Facebook leads", "Meta leads", "CSV processing", "lead filtering", "lead distribution"],
  authors: [{ name: "CULTJANI" }],
  creator: "CULTJANI",
  publisher: "CULTJANI",
  themeColor: "#121212",
  viewport: "width=device-width, initial-scale=1",
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: "CULTJANI - Lead Management System",
    description: "Process, filter, and distribute your Meta/Facebook leads efficiently",
    url: "/",
    siteName: "CULTJANI",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
