import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif, Manrope } from "next/font/google";
import { AuthProvider } from '@/context/AuthContext'
import { ToastContainer } from 'react-toastify'
import "./globals.css";
import SmoothScroll from '../smoothscroll/SmoothScroll';

const notoSerif = Noto_Serif({ variable: "--font-headline", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Redolence Nepal | Best Perfume in Nepal",
  description: "Shop premium niche, designer & Middle Eastern perfumes in Nepal. Authentic fragrances delivered to your door. Explore Redolence Nepal's curated collection.",
  keywords: ["perfume nepal", "niche perfume nepal", "buy perfume in nepal", "designer fragrance nepal", "middle eastern perfume nepal", "redolence nepal"],
  openGraph: {
    title: "Redolence Nepal | Best Perfume in Nepal",
    description: "Shop premium niche, designer & Middle Eastern perfumes in Nepal.",
    url: "https://redolencenepal.com",
    siteName: "Redolence Nepal",
    locale: "en_US",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${notoSerif.variable} ${manrope.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">

        <AuthProvider>
          <SmoothScroll>
            {children}
            <ToastContainer
              position="bottom-left"
              autoClose={3000}
            />
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}