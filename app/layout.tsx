import type { Metadata } from "next";
import { Archivo, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ArtSpace — Where African Art Finds Its Global Voice",
    template: "%s | ArtSpace",
  },
  description:
    "ArtSpace is the premier platform for African artists to showcase, sell, and connect. Portfolio, marketplace, events, and collector tools — all in one place.",
  keywords: ["African art", "art marketplace", "Nigerian art", "art platform", "buy African art"],
  authors: [{ name: "ArtSpace" }],
  creator: "ArtSpace",
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "ArtSpace",
    title: "ArtSpace — Where African Art Finds Its Global Voice",
    description:
      "The premier platform for African artists to showcase, sell, and connect with collectors worldwide.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtSpace — Where African Art Finds Its Global Voice",
    description: "The premier platform for African artists to showcase, sell, and connect.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${manrope.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
