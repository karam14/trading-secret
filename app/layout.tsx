import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import ClientLayout from './clientLayout';  // Import ClientLayout

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
      <head>
      {/* <!-- PWA Metadata --> */}
<meta name="application-name" content="PWA App" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="PWA App" />
<meta name="description" content="Best PWA App in the world" />
<meta name="format-detection" content="telephone=no" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="msapplication-config" content="/icons/browserconfig.xml" />
<meta name="msapplication-TileColor" content="#2B5797" />
<meta name="msapplication-tap-highlight" content="no" />
<meta name="theme-color" content="#000000" />

{/* <!-- Icons for iOS --> */}
<link rel="apple-touch-icon" sizes="180x180" href="/icons/192w/192.png" />
<link rel="apple-touch-icon" sizes="167x167" href="/icons/192w/192.png" />
<link rel="apple-touch-icon" sizes="152x152" href="/icons/192w/192.png" />
<link rel="apple-touch-icon" sizes="120x120" href="/icons/192w/192.png" />

{/* <!-- Icons for Android/Other devices --> */}
<link rel="icon" type="image/png" sizes="192x192" href="/icons/192w/192.png" />
<link rel="icon" type="image/png" sizes="512x512" href="/icons/512w/512.png" />

{/* <!-- Favicon and Pinned Safari Icon --> */}
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
<link rel="shortcut icon" href="/favicon.ico" />
<link rel="mask-icon" href="/icons/favicon.svg" color="#5bbad5" />

{/* <!-- PWA Manifest --> */}
<link rel="manifest" href="/manifest.json" />

{/* <!-- Additional iOS Meta Tags --> */}

{/* <!-- Place this in the head section --> */}

{/* <!-- Apple Touch Icons --> */}
<link rel="apple-touch-icon" sizes="180x180" href="/icons/192w/192.png" />
<link rel="apple-touch-icon" sizes="167x167" href="/icons/192w/192.png" />
<link rel="apple-touch-icon" sizes="152x152" href="/icons/192w/192.png" />
<link rel="apple-touch-icon" sizes="120x120" href="/icons/192w/192.png" />


{/* <!-- Apple Splash Screen Images --> */}
<link href="/icons/512w/512.png" sizes="2048x2732" rel="apple-touch-startup-image" />
<link href="/icons/512w/512.png" sizes="1668x2224" rel="apple-touch-startup-image" />
<link href="/icons/512w/512.png" sizes="1536x2048" rel="apple-touch-startup-image" />
<link href="/icons/512w/512.png" sizes="1125x2436" rel="apple-touch-startup-image" />
<link href="/icons/512w/512.png" sizes="1242x2208" rel="apple-touch-startup-image" />
<link href="/icons/512w/512.png" sizes="750x1334" rel="apple-touch-startup-image" />
<link href="/icons/512w/512.png" sizes="640x1136" rel="apple-touch-startup-image" />

<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />

      </head>
      <SpeedInsights />
      <Analytics />
      <body>
        {/* Wrap children with ClientLayout to ensure client-side components are loaded there */}
        <ClientLayout>
          <main>{children}</main>
        </ClientLayout>
      </body>
    </html>
  );
}
