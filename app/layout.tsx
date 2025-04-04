import React from 'react'; 
import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
const robotoSans = Roboto_Flex({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Rhed",
  description: "Rhamsez's content creation channel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body
        className={robotoSans.className}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
