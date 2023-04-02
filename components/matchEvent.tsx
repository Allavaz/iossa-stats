import MatchIcon from "./matchIcon";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { MatchEvent } from "../types";

export default function MatchEventComponent({
  item,
  side,
  index,
  editable,
  onRemoveEvent,
  setEditing
}: {
  item: MatchEvent;
  side: "home" | "away";
  index: number;
  editable: boolean;
  onRemoveEvent: (index: number) => void;
  setEditing: (editing: any) => void;
}) {
  if (side === "home") {
    if (
      (item.team === "home" && item.event !== "OWN GOAL") ||
      (item.team === "away" && item.event === "OWN GOAL")
    ) {
      return (
        <li key={index}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
            className="invisibleUnlessHoverParent"
          >
            {editable ? <div style={{ flex: 1 }}></div> : null}
            <div
              style={{
                marginLeft: "5px",
                marginRight: "5px",
                whiteSpace: "normal"
              }}
            >
              <MatchIcon event={item.event}></MatchIcon>
              <Link href={`/jugador/${item.player1SteamId}`}>
                <a>
                  <span>{item.name}</span>
                </a>
              </Link>{" "}
              {item.name2 && item.event === "GOAL" && (
                <Link href={`/jugador/${item.player2SteamId}`}>
                  <a>
                    <span
                      style={{
                        fontSize: "0.85em",
                        color: "var(--header-color)",
                        fontStyle: "italic"
                      }}
                    >{`(${item.name2})`}</span>
                  </a>
                </Link>
              )}{" "}
              {<span>{`(${Math.round(item.second / 60)}')`}</span>}
            </div>
            {editable ? (
              <div style={{ flex: 1, textAlign: "left" }}>
                <FontAwesomeIcon
                  className="invisibleUnlessHover"
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer"
                  }}
                  icon={faEdit}
                  onClick={e => {
                    setEditing({ event: index });
                  }}
                ></FontAwesomeIcon>
                <FontAwesomeIcon
                  className="invisibleUnlessHover"
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer"
                  }}
                  icon={faTrashAlt}
                  onClick={e => {
                    onRemoveEvent(index);
                  }}
                ></FontAwesomeIcon>
              </div>
            ) : null}
          </div>
        </li>
      );
    } else {
      return null;
    }
  } else {
    if (
      (item.team === "away" && item.event !== "OWN GOAL") ||
      (item.team === "home" && item.event === "OWN GOAL")
    ) {
      return (
        <li key={index}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
            className="invisibleUnlessHoverParent"
          >
            {editable ? <div style={{ flex: 1 }}></div> : null}
            <div
              style={{
                marginLeft: "5px",
                marginRight: "5px",
                whiteSpace: "normal"
              }}
            >
              <MatchIcon event={item.event}></MatchIcon>
              <Link href={`/jugador/${item.player1SteamId}`}>
                <a>
                  <span>{item.name}</span>
                </a>
              </Link>{" "}
              {item.name2 && item.event === "GOAL" && (
                <Link href={`/jugador/${item.player2SteamId}`}>
                  <a>
                    <span
                      style={{
                        fontSize: "0.85em",
                        color: "var(--header-color)",
                        fontStyle: "italic"
                      }}
                    >{`(${item.name2})`}</span>
                  </a>
                </Link>
              )}{" "}
              {<span>{`(${Math.round(item.second / 60)}')`}</span>}
            </div>
            {editable ? (
              <div style={{ flex: 1, textAlign: "left" }}>
                <FontAwesomeIcon
                  className="invisibleUnlessHover"
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer"
                  }}
                  icon={faEdit}
                  onClick={e => {
                    setEditing({ event: index });
                  }}
                ></FontAwesomeIcon>
                <FontAwesomeIcon
                  className="invisibleUnlessHover"
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer"
                  }}
                  icon={faTrashAlt}
                  onClick={e => {
                    onRemoveEvent(index);
                  }}
                ></FontAwesomeIcon>
              </div>
            ) : null}
          </div>
        </li>
      );
    } else {
      return null;
    }
  }
}
