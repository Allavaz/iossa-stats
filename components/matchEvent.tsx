import MatchIcon from "./matchIcon";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { MatchEvent } from "../types";
import MatchEventEditor from "./matchEventEditor";

export default function MatchEventComponent({
  item,
  index,
  editable,
  onRemoveEvent,
  setEditing
}: {
  item: MatchEvent;
  index: number;
  editable: boolean;
  onRemoveEvent: (index: number) => void;
  setEditing: (editing: any) => void;
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
        {editable ? (
          <div className="flex gap-x-1">
            <FontAwesomeIcon
              className="cursor-pointer"
              icon={faEdit}
              onClick={_ => {
                setEditing({ event: index });
              }}
            />
            <FontAwesomeIcon
              className="cursor-pointer"
              icon={faTrashAlt}
              onClick={_ => {
                onRemoveEvent(index);
              }}
            />
          </div>
        ) : null}
      </div>
    </li>
  );
}
