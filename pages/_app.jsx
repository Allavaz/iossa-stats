import Layout from "../components/layout";
import "../styles/globals.css";
import Head from "next/head";
import NextTopLoader from "nextjs-toploader";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="theme-color" content="#e28800" />
      </Head>
      <NextTopLoader color="#ff9800" height={2} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
