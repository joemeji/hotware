import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "@/components/ui/toaster";
import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme,
} from "@material/material-color-utilities";
import { wrapper } from "@/store";
import { Provider } from "react-redux";

if (typeof window !== "undefined") {
  const theme = themeFromSourceColor(argbFromHex("#000000"), [
    {
      name: "custom-1",
      value: argbFromHex("#000000"),
      blend: true,
    },
  ]);
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(theme, { target: document.body, dark: systemDark });
}

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { store } = wrapper.useWrappedStore(pageProps);

  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <NextNProgress color="#d30000" />
        <Component {...pageProps} />
        <Toaster />
      </Provider>
    </SessionProvider>
  );
}

export default App;
