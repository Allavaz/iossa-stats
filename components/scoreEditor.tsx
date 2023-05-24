import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";

export default function ScoreEditor(props) {
  function sendScore() {
    let home = (document.getElementById("homeScore") as HTMLInputElement).value;
    let away = (document.getElementById("awayScore") as HTMLInputElement).value;
    props.onChangeScore(home, away);
    props.setEditing(null);
  }

  return (
    <div className="flex items-center justify-center gap-x-1">
      <div>
        <input
          className="w-16 rounded-lg border border-neutral-300 px-1 text-right text-2xl font-bold shadow-lg dark:border-neutral-700"
          type="number"
          id="homeScore"
          defaultValue={props.home}
          min="0"
          max="99"
        />
        <span className="text-2xl font-bold"> - </span>
        <input
          className="w-16 rounded-lg border border-neutral-300 px-1 text-left text-2xl font-bold shadow-lg dark:border-neutral-700"
          type="number"
          id="awayScore"
          defaultValue={props.away}
          min="0"
          max="99"
        />
      </div>
      <div className="flex gap-x-1">
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="cursor-pointer"
          size="lg"
          onClick={_ => sendScore()}
        />
        <FontAwesomeIcon
          icon={faTimesCircle}
          className="cursor-pointer"
          size="lg"
          onClick={_ => props.setEditing(null)}
        />
      </div>
    </div>
  );
}
