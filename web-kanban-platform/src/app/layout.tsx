import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/contexts/themeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kanban Platform <crsv>",
  description: "by CaioRSV with Next.js",
};

// Hydration warning apenas na camada de html, server components não serão afetados por questão de depth

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark">
          {children}
        </ThemeProvider>
        </body>  
    </html>
  );
}
