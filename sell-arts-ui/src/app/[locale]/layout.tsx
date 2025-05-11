import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Chatbot from "./(website)/chatbot";
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<any> }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  return (
    <div>
      <div>
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-[80vh]">{children}</div>
          {/* Only show Chatbot if user is logged in */}
            <Chatbot />
        </NextIntlClientProvider>
      </div>
    </div>
  );
}
