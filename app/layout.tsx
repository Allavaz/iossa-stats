import { Metadata, Viewport } from "next";
import "../styles/globals.css";
import Navigation from "../components/navigation";
import Header from "../components/header";
import Footer from "../components/footer";
import NextTopLoader from "nextjs-toploader";

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
import { SessionProvider } from "next-auth/react";
import { TeamsProvider } from "../context/TeamsContext";
import { getTeamsMap } from "../lib/getFromDB";
import { connection } from "next/server";
config.autoAddCss = false; /* eslint-disable import/first */

export const metadata: Metadata = {
  title: {
    template: "%s | IOSoccer Sudamérica",
    default: "IOSoccer Sudamérica"
  },
  description:
    "Comunidad sudamericana de IOSoccer. Resultados, estadísticas, rankings y más.",
  openGraph: {
    siteName: "IOSoccer Sudamérica",
    type: "website",
    images: [
      {
        url: "/logo-solo.png"
      }
    ]
  },
  metadataBase: new URL("https://iosoccer-sa.com")
};

export const viewport: Viewport = {
  themeColor: "#e28800"
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await connection();
  const initialTeamsMap = await getTeamsMap();
  return (
    <html lang="es">
      <body className="bg-neutral-50 dark:bg-neutral-950 dark:text-white">
        <SessionProvider>
          <TeamsProvider initialTeamsMap={initialTeamsMap}>
            <NextTopLoader color="#ff9800" height={2} />
            <Navigation />
            <Header />
            <div className="mt-16 px-2 sm:m-auto sm:max-w-6xl sm:p-0">
              <main>{children}</main>
            </div>
            <Footer />
          </TeamsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
