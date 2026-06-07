import type { Metadata } from "next";
import { ConfigProvider } from "@atomizeui/core";
import "./globals.css";
import "./dashboard.css";
import { ThemeScript } from "./theme-script";

export const metadata: Metadata = {
  title: {
    default: "Atomize UI — Dashboard Kit",
    template: "%s · Atomize UI",
  },
  description: "Production-ready admin dashboard built with @atomizeui/core. Free, MIT licensed.",
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
        <ConfigProvider>{children}</ConfigProvider>
      </body>
    </html>
  );
}
