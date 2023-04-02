import {
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import { useMemo } from "react";

type Props = {
  date: string;
  onChangeDate: (date: string) => void;
  setEditing: (editing: string) => void;
};

export default function DateTimeEditor({
  date,
  onChangeDate,
  setEditing
}: Props) {
  function formatAndSendDate(date: string) {
    let dt = DateTime.fromISO(date);
    onChangeDate(dt.toUTC().toString());
    setEditing(null);
  }

  const dt = useMemo(() => DateTime.fromISO(date), [date]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div style={{ marginLeft: "5px", marginRight: "5px" }}>
        <input
          id="inputDate"
          type="datetime-local"
          style={{ width: "25ch" }}
          defaultValue={dt.toFormat("y-LL-dd'T'HH:mm")}
        ></input>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "30px"
        }}
      >
        <FontAwesomeIcon
          icon={faCheckCircle}
          style={{ cursor: "pointer" }}
          onClick={e =>
            formatAndSendDate(
              (document.getElementById("inputDate") as HTMLInputElement).value
            )
          }
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          icon={faTimesCircle}
          style={{ cursor: "pointer" }}
          onClick={e => setEditing(null)}
        ></FontAwesomeIcon>
      </div>
    </div>
  );
}
