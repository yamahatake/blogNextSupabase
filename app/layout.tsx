import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href="/">Home</Link>
                  </div>
                  <div className="flex gap-5 items-center">
                    <ThemeSwitcher />
                    {hasEnvVars && (
                      <Suspense>
                        <AuthButton />
                      </Suspense>
                    )}
                  </div>
                </div>
              </nav>
              <div className="flex-1 flex flex-col gap-12 max-w-5xl w-full p-5 pt-10">
                <Suspense>
                  {children}
                </Suspense>
              </div>
              <footer className="w-full flex items-center justify-center border-t text-xs gap-8 py-10 mt-20">
                
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
