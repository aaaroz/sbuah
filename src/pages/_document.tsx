import { GeistSans } from "geist/font/sans";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className={GeistSans.className}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
