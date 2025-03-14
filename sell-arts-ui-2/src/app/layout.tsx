import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SellArts",
  description: "Generated by create next app",
};

import "./globals.css";
import ClientWrapper from "./[locale]/clientWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "pwfdy1sfiz");
            `,
          }}
        />
      </head>
      <body className="antialiased" cz-shortcut-listen="true">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}