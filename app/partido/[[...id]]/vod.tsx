import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Title from "../../../components/ui/title";
import { useMatchEditor } from "../../../context/MatchEditorContext";

export default function Vod({ vod: vodProp, editable }: { vod?: string; editable?: boolean }) {
  const ctx = useMatchEditor();
  const vod = editable ? ctx.match.vod : vodProp;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center gap-x-2">
        <Title style={{ display: "inline", width: "fit-content" }}>
          VIDEO DEL PARTIDO
        </Title>
        {editable ? (
          <div className="flex gap-x-1">
            <FontAwesomeIcon
              icon={faEdit}
              className="cursor-pointer"
              onClick={_ => ctx.setEditing("vod")}
            />
            <FontAwesomeIcon
              icon={faTrashAlt}
              className="cursor-pointer"
              onClick={_ => ctx.changeVod(null)}
            />
          </div>
        ) : null}
      </div>
      <iframe
        title="vod"
        className="aspect-video w-full"
        src={"https://www.youtube.com/embed/" + vod}
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
