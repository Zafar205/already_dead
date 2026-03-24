import type { Metadata } from "next";
import { Roboto_Condensed, Space_Mono } from "next/font/google";
import "./globals.css";

const displayFont = Roboto_Condensed({
  variable: "--font-display",
  weight: "700",
  subsets: ["latin"],
});

const bodyFont = Space_Mono({
  variable: "--font-body",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dark Phantom Store | Official Merch",
  description: "Official Dark Phantom merch store for limited drops, signature pieces, and creator gear.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
