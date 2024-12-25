import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";

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
      <body
        className={robotoSans.className}
      >
        {children}
      </body>
    </html>
  );
}
