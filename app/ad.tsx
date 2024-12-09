import Script from "next/script";

export function SquareAd() {
  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9388182741516536`}
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9388182741516536"
        data-ad-slot="6939637462"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script
        strategy="afterInteractive"
        id="google-adsense"
        dangerouslySetInnerHTML={{
          __html: `
          (adsbygoogle = window.adsbygoogle || []).push({});
        `
        }}
      />
    </>
  );
}

export function RectangleAd() {
  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9388182741516536`}
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9388182741516536"
        data-ad-slot="8061147448"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script
        strategy="afterInteractive"
        id="google-adsense"
        dangerouslySetInnerHTML={{
          __html: `
          (adsbygoogle = window.adsbygoogle || []).push({});
        `
        }}
      />
    </>
  );
}
