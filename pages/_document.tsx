import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head />
      <body className="bg-stone-100 overflow-y-scroll">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
