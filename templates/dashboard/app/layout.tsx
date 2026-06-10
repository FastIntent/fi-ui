import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { ConfigProvider } from "@atomizeui/core";
import "./globals.css";
import "./dashboard.css";
import "./themes/index.css";
import { ThemeScript } from "./theme-script";

export const metadata: Metadata = {
  title: {
    default: "AtomizeUI — Dashboard Kit",
    template: "%s · AtomizeUI",
  },
  description: "Production-ready admin dashboard built with AtomizeUI. Free, MIT licensed.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-kit-theme="ember" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <NextTopLoader
          color="var(--atom-primary-color)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={4}
          crawl
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--atom-primary-color), 0 0 5px var(--atom-primary-color)"
        />
        <ConfigProvider>{children}</ConfigProvider>
      </body>
    </html>
  );
}
