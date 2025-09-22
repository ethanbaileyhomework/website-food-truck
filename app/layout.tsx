import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Analytics } from "@/components/layout/analytics";
import { IdentityRedirect } from "@/components/layout/identity-redirect";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StructuredData } from "@/components/layout/structured-data";
import { getSiteSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const description = settings.seo?.defaultDescription ?? settings.siteTagline;
  const ogImage = settings.seo?.ogImage
    ? [`https://cranbournefoodtruck.com${settings.seo.ogImage}`]
    : undefined;

  return {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: description,
    icons: {
      icon: "/favicon.svg",
    },
    openGraph: {
      title: settings.siteName,
      description: description,
      type: "website",
      url: "https://cranbournefoodtruck.com",
      images: ogImage,
      siteName: settings.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteName,
      description: description,
      images: ogImage,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#C3423F",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className="bg-sand">
      <head>
        <StructuredData settings={settings} />
      </head>
      <body className="min-h-screen bg-sand text-charcoal">
        <Header siteName={settings.siteName} />
        <IdentityRedirect />
        <main className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">{children}</main>
        <Footer settings={settings} />
        <Analytics measurementId={settings.analytics?.gaMeasurementId} />
      </body>
    </html>
  );
}
