import MatchIcon from "./matchIcon";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export default function MatchEvent(props) {
  const [eventHovering, setEventHovering] = useState(false);
  if (props.side === "home") {
    if (
      (props.item.team === "home" && props.item.event !== "OWN GOAL") ||
      (props.item.team === "away" && props.item.event === "OWN GOAL")
    ) {
      return (
        <li key={props.index}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
            onMouseOver={e => setEventHovering(true)}
            onMouseOut={e => setEventHovering(false)}
          >
            {props.editable ? <div style={{ flex: 1 }}></div> : null}
            <div
              style={{
                marginLeft: "5px",
                marginRight: "5px",
                whiteSpace: "normal"
              }}
            >
              <MatchIcon event={props.item.event}></MatchIcon>
              <Link href={`/jugador/${props.item.player1SteamId}`} passHref>
                <span>{props.item.name}</span>
              </Link>{" "}
              {props.item.name2 && props.item.event === "GOAL" && (
                <Link href={`/jugador/${props.item.player2SteamId}`} passHref>
                  <span
                    style={{
                      fontSize: "0.85em",
                      color: "var(--header-color)",
                      fontStyle: "italic"
                    }}
                  >{`(${props.item.name2})`}</span>
                </Link>
              )}{" "}
              {<span>{`(${Math.round(props.item.second / 60)}')`}</span>}
            </div>
            {props.editable ? (
              <div style={{ flex: 1, textAlign: "left" }}>
                <FontAwesomeIcon
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    opacity: eventHovering ? "100%" : "0%"
                  }}
                  icon={faEdit}
                  onClick={e => {
                    props.setEditing({ event: props.index });
                    props.setScoreHovering(false);
                  }}
                ></FontAwesomeIcon>
                <FontAwesomeIcon
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    opacity: eventHovering ? "100%" : "0%"
                  }}
                  icon={faTrashAlt}
                  onClick={e => {
                    props.onRemoveEvent(props.index);
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
      (props.item.team === "away" && props.item.event !== "OWN GOAL") ||
      (props.item.team === "home" && props.item.event === "OWN GOAL")
    ) {
      return (
        <li key={props.index}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
            onMouseOver={e => setEventHovering(true)}
            onMouseOut={e => setEventHovering(false)}
          >
            {props.editable ? <div style={{ flex: 1 }}></div> : null}
            <div
              style={{
                marginLeft: "5px",
                marginRight: "5px",
                whiteSpace: "normal"
              }}
            >
              <MatchIcon event={props.item.event}></MatchIcon>
              <Link href={`/jugador/${props.item.player1SteamId}`} passHref>
                <span>{props.item.name}</span>
              </Link>{" "}
              {props.item.name2 && props.item.event === "GOAL" && (
                <Link href={`/jugador/${props.item.player2SteamId}`} passHref>
                  <span
                    style={{
                      fontSize: "0.85em",
                      color: "var(--header-color)",
                      fontStyle: "italic"
                    }}
                  >{`(${props.item.name2})`}</span>
                </Link>
              )}{" "}
              {<span>{`(${Math.round(props.item.second / 60)}')`}</span>}
            </div>
            {props.editable ? (
              <div style={{ flex: 1, textAlign: "left" }}>
                <FontAwesomeIcon
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    opacity: eventHovering ? "100%" : "0%"
                  }}
                  icon={faEdit}
                  onClick={e => {
                    props.setEditing({ event: props.index });
                    props.setScoreHovering(false);
                  }}
                ></FontAwesomeIcon>
                <FontAwesomeIcon
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    opacity: eventHovering ? "100%" : "0%"
                  }}
                  icon={faTrashAlt}
                  onClick={e => {
                    props.onRemoveEvent(props.index);
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
