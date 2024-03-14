import type { Metadata } from "next";
import { poppins, lato } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avova Health",
  description: "Your Health, Simplified",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen ${lato.className}`}>{children}</body>
    </html>
  );
}
