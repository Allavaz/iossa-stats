import Button from "./commons/button";
import Card from "./commons/card";
import Title from "./commons/title";
import { useState } from "react";

export default function VodEditor(props) {
  const [id, setId] = useState(props.vod === null ? "" : props.vod);

  return (
    <div className="flex flex-col gap-y-4">
      <Title>{props.vod ? "Editar" : "Agregar"} VOD</Title>
      <Card>
        <div className="flex aspect-video w-full items-center justify-center gap-x-2">
          <input
            type="text"
            id="inputVod"
            placeholder="ID del VOD (Ej: lQMMnMvnMLk)"
            defaultValue={id}
            className="w-72 rounded-lg border border-neutral-300 p-2 dark:border-neutral-700"
            autoComplete="off"
            onChange={e => setId(e.target.value)}
          />
          <Button
            onClick={_ => {
              props.changeVod(id.trim());
              props.setEditing(null);
            }}
            disabled={id.length === 0}
          >
            Guardar
          </Button>
          <Button onClick={_ => props.setEditing(null)}>Cancelar</Button>
        </div>
      </Card>
    </div>
  );
}
