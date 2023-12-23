import Head from "next/head";

export default function Rules() {
  return (
    <>
      <Head>
        <title>Reglas | IOSoccer Sudamérica</title>
        <meta name="title" content={`Reglas | IOSoccer Sudamérica`} />
        <meta name="description" content={`Reglas IOSoccer Sudamérica`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Reglas | IOSoccer Sudamérica`} />
        <meta
          property="og:description"
          content={`Reglas IOSoccer Sudamérica`}
        />
        <meta property="og:image" content="/logo-solo.png" />
        <meta property="og:site_name" content="IOSoccer Sudamérica" />
      </Head>
      <iframe
        className="h-[60vh] w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700"
        src="https://docs.google.com/document/d/e/2PACX-1vRGoSw89vdyVK3SdFbEOarAfcjCyz9f7SgCAyYSOgDtWTvnvAJWaRSXDWj3EB7C5f6bWENE2r6UHRmg/pub?embedded=true"
      />
    </>
  );
}
