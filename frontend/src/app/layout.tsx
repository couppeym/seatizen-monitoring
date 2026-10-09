import type { Metadata } from "next";
import { outfit } from "@/app/ui/fonts";
import "@/app/ui/globals.css";
import "@/app/ui/leaflet-splitmap/layout.css";
import "@/app/ui/leaflet-splitmap/range.css";
import "@/app/ui/edna-tooltip.css";
import "@/app/ui/gcrmn-tooltip.css";
import "@/app/ui/comparison-tooltip.css";

import Script from "next/script";

export const metadata: Metadata = {
    title: {
        template: "%s | Seatizen Monitoring",
        default: "Seatizen Monitoring",
    },
    description: "Seatizen Monitoring",
    verification: {
        google: "n38t0e8f9xz3weXm0KHZn1p9Q4aLrCZKJCv3lR8GFlo",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body className={`${outfit.className} antialiased`}>
                <Script src="/runtime-config.js" strategy="beforeInteractive" />
                {children}
                <p className="hidden"> Made by Victor ILLIEN - https://github.com/Gouderg</p>
            </body>
        </html>
    );
}
