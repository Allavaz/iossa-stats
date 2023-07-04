import { Metadata } from "next";
import "../styles/globals.css";
import Navigation from "../components/navigation";
import Header from "../components/header";
import Footer from "../components/footer";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: {
    template: "%s | IOSoccer Sudamérica",
    default: "IOSoccer Sudamérica"
  },
  description:
    "Comunidad sudamericana de IOSoccer. Resultados, estadísticas, rankings y más.",
  themeColor: "#e28800",
  openGraph: {
    siteName: "IOSoccer Sudamérica",
    type: "website",
    images: [
      {
        url: "/logo-solo.png"
      }
    ]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-neutral-50 dark:bg-neutral-950 dark:text-white">
        <NextTopLoader color="#ff9800" height={2} />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/theme.js" />
        <Navigation />
        <Header />
        <div className="mt-16 px-2 sm:m-auto sm:max-w-6xl sm:p-0">
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
