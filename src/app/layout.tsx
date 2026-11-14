import type { Metadata, Viewport } from "next";
import { site } from "@/config/site";
import { Providers } from "@/components/Providers";
import { DemoPanelLoader } from "@/components/demo/DemoPanelLoader";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";
import { display, hand, montserrat, script } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    locale: "pt_BR",
    siteName: site.title,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#fdfcf9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${montserrat.variable} ${script.variable} ${hand.variable}`}>
      <body>
        <Providers>
          {children}
          <WhatsAppFab />
          {site.demo && <DemoPanelLoader />}
        </Providers>
      </body>
    </html>
  );
}
