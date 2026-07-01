import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { PhoneFrame } from "@/components/ui/phone-frame";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Housemaid.com — Trusted housemaids & employers in UAE",
  description:
    "Connecting trusted housemaids and employers across UAE. Find the right job or hire the perfect match.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} antialiased`}>
      <body>
        <PhoneFrame>{children}</PhoneFrame>
      </body>
    </html>
  );
}
