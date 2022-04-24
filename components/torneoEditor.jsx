import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import AutocompleteTorneos from "./autocompleteTorneos";

export default function TorneoEditor(props) {
  const [value, setValue] = useState(props.torneo);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10px"
      }}
    >
      <div style={{ flex: 1 }}></div>
      <div style={{ marginLeft: "5px", marginRight: "5px" }}>
        <AutocompleteTorneos defaultValue={props.torneo} setValue={setValue} />
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "35px"
          }}
        >
          <FontAwesomeIcon
            icon={faCheckCircle}
            style={{ cursor: "pointer", color: "var(--normal-text-color)" }}
            onClick={e => props.onChangeTorneo(value)}
          />
          <FontAwesomeIcon
            icon={faTimesCircle}
            style={{ cursor: "pointer", color: "var(--normal-text-color)" }}
            onClick={e => props.setEditing(null)}
          />
        </div>
      </div>
    </div>
  );
}