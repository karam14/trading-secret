import dynamic from 'next/dynamic';
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import AuthButton from "@/components/AuthButton";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import NextTopLoader from 'nextjs-toploader';
import ClientLayout from './clientLayout';

const DynamicThemeProvider = dynamic(() => import("next-themes").then(mod => mod.ThemeProvider), { ssr: false });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Viewzen Academy",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <SpeedInsights />
      <Analytics />
      <ClientLayout>
      <body>
        <NextTopLoader />
        <DynamicThemeProvider attribute="class" defaultTheme="dark">
          <main>
            <ToastProvider />
            {children}
          </main>
        </DynamicThemeProvider>
      </body>
      </ClientLayout>
    </html>
  );
}
