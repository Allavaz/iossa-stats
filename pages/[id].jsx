import { getPlayers } from "../lib/getFromDB";
import Match from "./partido/[[...id]]";

export async function getServerSideProps(context) {
  if (context.params.id === process.env.ENDPOINT) {
    let players = await getPlayers("mini");
    let props = { players: JSON.parse(JSON.stringify(players)) };
    return { props };
  } else {
    return { notFound: true };
  }
}

export default function Upload({ players }) {
  return <Match players={players} create />;
}
