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
    <div className="flex items-center justify-center gap-x-1">
      <AutocompleteTorneos defaultValue={props.torneo} setValue={setValue} />
      <FontAwesomeIcon
        icon={faCheckCircle}
        className="cursor-pointer"
        onClick={_ => props.onChangeTorneo(value)}
      />
      <FontAwesomeIcon
        icon={faTimesCircle}
        className="cursor-pointer"
        onClick={_ => props.setEditing(null)}
      />
    </div>
  );
}
