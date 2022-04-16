import Layout from "../components/layout";
import "../styles/globals.css";
import NextNProgress from "nextjs-progressbar";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
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
