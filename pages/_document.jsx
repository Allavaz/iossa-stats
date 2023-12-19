import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head />
      <body className="bg-neutral-50 dark:bg-neutral-950 dark:text-white">
        {
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script src="/theme.js" />
        }
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
