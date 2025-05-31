import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Chatbot from "./(website)/chatbot";
import Script from "next/script";

export const metadata = {
  title: "Sellarts - Marketplace d'art africain contemporain",
  description:
    "Sellarts est une marketplace dédiée à l'art africain contemporain, mettant en relation artistes, collectionneurs et passionnés à l’échelle mondiale.",
  openGraph: {
    title: "Sellarts - Marketplace d'art africain contemporain",
    description:
      "Sellarts connecte artistes, collectionneurs et passionnés d’art africain contemporain à l’échelle mondiale.",
    type: "website",
    // images: ["https://sellarts.com/images/og-image.jpg"],
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<any>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Google Ads / Tag */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-16934517440"
        />
        <Script
          id="google-ads"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-16934517440');
            `,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-[80vh]">{children}</div>
          {/* <Chatbot /> */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
