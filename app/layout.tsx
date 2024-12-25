import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const robotoSans = Roboto({
  weight: "400",
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
