import Button from "./commons/button";
import Card from "./commons/card";
import Title from "./commons/title";

export default function VodEditor(props) {
  return (
    <div className="flex flex-col gap-y-4">
      <Title>{props.vod ? "Editar" : "Agregar"} VOD</Title>
      <Card>
        <div className="flex aspect-video w-full items-center justify-center gap-x-2">
          <input
            type="text"
            placeholder="ID del VOD (Ej: lQMMnMvnMLk)"
            defaultValue={props.vod === null ? "" : props.vod}
            className="w-72 rounded-lg border border-neutral-300 p-2 dark:border-neutral-700"
            autoComplete="off"
            onChange={e =>
              e.target.value.length
                ? props.setEditing("vod")
                : props.setEditing(null)
            }
          />
          <Button
            onClick={_ => {
              props.changeVod(
                (
                  document.getElementById("inputVod") as HTMLInputElement
                ).value.trim()
              );
              props.setEditing(null);
            }}
          >
            Guardar
          </Button>
        </div>
      </Card>
    </div>
  );
}
