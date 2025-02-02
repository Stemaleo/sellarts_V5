// components/IntlProvider.tsx
"use client";

import { IntlProvider } from "next-intl";
import { ReactNode } from "react";

interface ProviderProps {
  children: ReactNode;
  locale: string;
}

export default function CustomIntlProvider({ children, locale }: ProviderProps) {
  return (
    <IntlProvider
      locale={"en"}
      messages={{
        en: {
          test: "HHN",
        },
      }}
      timeZone="UTC"
    >
      {children}
    </IntlProvider>
  );
}
