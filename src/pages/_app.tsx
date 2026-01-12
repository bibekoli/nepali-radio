import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Play as Font } from "next/font/google";
import Head from "next/head";
import Script from "next/script";

const font = Font({
  subsets: ["latin"],
  weight: ["400"]
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>BiTunes - Listen Nepali Radio</title>
        <meta name="description" content="Listen to your favorite Nepali radio stations with a modern, elegant interface. Stream live radio from Nepal with advanced features." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script id="clarity-analytics" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "v0e8tocogz");
        `}
      </Script>
      <main className={font.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
