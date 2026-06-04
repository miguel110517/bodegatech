import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bodega Tech",
    template: "%s | Bodega Tech",
  },

  description:
    "Tienda de tecnología, accesorios, periféricos y gadgets para toda Colombia.",

  keywords: [
    "tecnología",
    "computadores",
    "accesorios",
    "gadgets",
    "periféricos",
    "bodega tech",
    "colombia",
  ],

  authors: [
    {
      name: "Miguel Macea",
    },
  ],

  creator: "Miguel Macea",

  openGraph: {
    title: "Bodega Tech",
    description:
      "Tecnología, accesorios y gadgets para toda Colombia.",
    type: "website",
    locale: "es_CO",
    siteName: "Bodega Tech",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${outfit.className} min-h-screen bg-black text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}