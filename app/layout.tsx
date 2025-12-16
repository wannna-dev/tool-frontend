import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";
import { AppProvider } from "@/context/AppContext";
import { AuthHandler } from "./auth-handler";


// Diatype Expanded Font
const diaypeExpandedFont = localFont({
  src: [
    { path: "./fonts/Diatype Expanded/ABCDiatypeExpanded-Bold.woff2" },
    { path: "./fonts/Diatype Expanded/ABCDiatypeExpanded-Bold.woff" },
  ],
  variable: "--font-diatype-expanded",
  display: "swap",
});

// Diatype Semi Mono Font
const diatypeSemiMonoFont = localFont({
  src: [
    { path: "./fonts/ABCDiatypeSemi-MonoVariable-Trial.woff2" },
    { path: "./fonts/ABCDiatypeSemi-MonoVariable-Trial.woff" },
  ],
  variable: "--font-diatype-semi-mono",
  display: "swap",
});

const diatypeBoldTrialFont = localFont({
  src: [
    { path: "./fonts/ABCDiatype-Bold-Trial.otf" },
  ],
  variable: "--font-diatype-bold-trial",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WANNA",
  description: "The largest collection of human experiences.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicon/favicon_light.png",
        href: "/favicon/favicon_light.png",
      },
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon/favicon_dark.png",
        href: "/favicon/favicon_dark.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${diatypeSemiMonoFont.variable} ${diaypeExpandedFont.variable} ${diatypeBoldTrialFont.variable}`}>
        <AppProvider>
          <AuthHandler />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
