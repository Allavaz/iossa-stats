import Layout from "../components/layout";
import "../styles/globals.css";
import { useEffect } from "react";
import NextNProgress from "nextjs-progressbar";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const currentTheme = localStorage.getItem("theme")
      ? localStorage.getItem("theme")
      : null;

    if (currentTheme) {
      document.documentElement.setAttribute("data-theme", currentTheme);
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="theme-color" content="#e28800" />
      </Head>
      <NextNProgress color="#ff9800" height={2} showOnShallow={false} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
