import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/contexts/themeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kanban Platform <crsv>",
  description: "by CaioRSV with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="dark"
        >
        {children}
        </ThemeProvider>
        </body>  
    </html>
  );
}
