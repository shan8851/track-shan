import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

import { QueryProvider } from "@/providers/queryProvider";

import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "track-shan",
  description: "Personal tracking dashboard",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="en" className="dark">
    <body className={`${jetbrainsMono.variable} antialiased`}>
      <QueryProvider>{children}</QueryProvider>
    </body>
  </html>
);

export default RootLayout;
