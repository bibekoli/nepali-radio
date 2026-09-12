import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>BiTunes — Nepal sounds better live</title>
        <meta name="description" content="Discover and stream live Nepali radio stations, music, news and stories from across the country." />
        <meta name="theme-color" content="#101b24" />
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
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
