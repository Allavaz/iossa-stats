import Button from "../../../components/ui/button";
import Card from "../../../components/ui/card";
import Title from "../../../components/ui/title";
import { useState } from "react";
import { useMatchEditor } from "../../../context/MatchEditorContext";

export default function VodEditor() {
  const { match, changeVod, setEditing } = useMatchEditor();
  const vod = match.vod;
  const [id, setId] = useState(vod === null ? "" : vod);

  return (
    <div className="flex flex-col gap-y-4">
      <Title>{vod ? "Editar" : "Agregar"} VOD</Title>
      <Card>
        <div className="flex aspect-video w-full items-center justify-center gap-x-2">
          <input
            type="text"
            id="inputVod"
            placeholder="ID del VOD (Ej: lQMMnMvnMLk)"
            defaultValue={id}
            className="w-72 rounded-lg border border-neutral-300 p-2 dark:border-neutral-700 dark:bg-neutral-900"
            autoComplete="off"
            onChange={e => setId(e.target.value)}
          />
          <Button
            onClick={_ => {
              changeVod(id.trim());
              setEditing(null);
            }}
            disabled={id.length === 0}
          >
            Guardar
          </Button>
          {vod && (
            <Button onClick={_ => setEditing(null)}>Cancelar</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
