import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { ConfigProvider } from "@atomizeui/core";
import "./globals.css";
import "./dashboard.css";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <NextTopLoader
          color="#6BBF00"
          initialPosition={0.08}
          crawlSpeed={200}
          height={4}
          crawl
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #6BBF00, 0 0 5px #6BBF00"
        />
        <ConfigProvider>{children}</ConfigProvider>
      </body>
    </html>
  );
}
