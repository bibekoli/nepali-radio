import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Delius as Font } from "next/font/google";
import Head from "next/head";

const font = Font({
  subsets: ["latin"],
  weight: ["400"]
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>BiTunes - Listen to your favorite Nepali radio stations</title>
      </Head>
      <main className={font.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
