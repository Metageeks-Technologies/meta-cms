import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "../context/userContext";
import { PostProvider } from "@/context/postContext";
import { ProductProvider } from "@/context/productContext";
import { WebsiteProvider } from "@/context/websiteContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Meta CMS - Powerful Content Management",
  description: "Meta CMS by Metageeks: A seamless and efficient platform for managing your content with ease and flexibility.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} styledScrollable`}>
          <UserProvider>
            <WebsiteProvider>
              <ProductProvider>
                <main className="w-full bg-[#06040B] text-gray-200">
                  <Toaster />
                  {children}
                </main>
              </ProductProvider>
            </WebsiteProvider>
          </UserProvider>
        </body>
      </html>
    </>
  );
}
