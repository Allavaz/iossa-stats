import Match from "./partido/[[...id]]";

export async function getStaticPaths() {
  let paths = [{ params: { id: process.env.ENDPOINT } }];
  return { paths, fallback: false };
}

export async function getStaticProps() {
  return { props: {} };
}

export default function Upload({}) {
  return <Match create={true} />;
}
