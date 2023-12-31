import MatchIcon from "../../../components/matchIcon";
import Link from "next/link";
import { MatchEvent } from "../../../types";

export default function MatchEventComponent({
  item,
  index
}: {
  item: MatchEvent;
  index: number;
}) {
  return (
    <li key={index}>
      <div className="flex items-center justify-center gap-x-1 p-1 text-sm">
        <MatchIcon event={item.event} />
        <Link href={`/jugador/${item.player1SteamId}`}>
          <span>{item.name}</span>
        </Link>
        {item.name2 && item.event === "GOAL" && (
          <div className="hidden sm:block">
            <Link href={`/jugador/${item.player2SteamId}`}>
              <span className="text-xs italic text-neutral-500 dark:text-neutral-400">{`(${item.name2})`}</span>
            </Link>
          </div>
        )}
        <span>{`(${Math.round(item.second / 60)}')`}</span>
      </div>
    </li>
  );
}
