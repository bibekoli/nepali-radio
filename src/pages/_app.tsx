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
        <title>BiTunes v2 - Modern Nepali Radio Experience</title>
        <meta name="description" content="Listen to your favorite Nepali radio stations with a modern, elegant interface. Stream live radio from Nepal with advanced features." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={font.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
