import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif, Manrope } from "next/font/google";
import { AuthProvider } from '@/context/AuthContext'
import { ToastContainer } from 'react-toastify'
import "./globals.css";
import Script from "next/dist/client/script";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const notoSerif = Noto_Serif({ variable: "--font-headline", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Redolence Nepal | Best Perfume in Nepal",
  description: "Premium perfumes in Nepal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${notoSerif.variable} ${manrope.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
      <body className="antialiased">


        <AuthProvider>

          {children}
          <ToastContainer
            position="bottom-left"
            autoClose={3000}
          />
        </AuthProvider>
      </body>
    </html>
  );
}