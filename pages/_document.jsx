import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head />
      <body className="bg-neutral-50 dark:bg-neutral-950 dark:text-white">
        <script src="/theme.js" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
