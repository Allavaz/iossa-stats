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
    <div className="flex items-center justify-center gap-x-1">
      <input
        id="inputDate"
        type="datetime-local"
        className="w-48 rounded-lg border border-neutral-200 text-center text-sm shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        defaultValue={dt.toFormat("y-LL-dd'T'HH:mm")}
      />
      <FontAwesomeIcon
        icon={faCheckCircle}
        className="cursor-pointer"
        onClick={_ =>
          formatAndSendDate(
            (document.getElementById("inputDate") as HTMLInputElement).value
          )
        }
      />
      <FontAwesomeIcon
        icon={faTimesCircle}
        className="cursor-pointer"
        onClick={_ => setEditing(null)}
      />
    </div>
  );
}
