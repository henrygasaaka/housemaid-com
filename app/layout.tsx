import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { PhoneFrame } from "@/components/ui/phone-frame";
import { isRtlLocale } from "@/lib/i18n-config";
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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("openGraphTitle"),
    },
    appleWebApp: {
      title: t("appleWebAppTitle"),
    },
    applicationName: t("applicationName"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir = isRtlLocale(locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${poppins.variable} antialiased`}
    >
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <PhoneFrame>{children}</PhoneFrame>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
