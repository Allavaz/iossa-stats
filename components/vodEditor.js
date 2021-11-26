export default function VodEditor(props) {
  let height = (900 / 16) * 9 - (35 + 10);
  return (
    <div>
      <h3>{props.vod ? "EDITAR" : "AGREGAR"} VOD</h3>
      <div
        className="whitespace"
        style={{
          height: height,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          columnGap: "15px"
        }}
      >
        <input
          type="text"
          id="inputVod"
          placeholder="ID del VOD (Ej: lQMMnMvnMLk)"
          defaultValue={props.vod === null ? "" : props.vod}
          style={{
            width: "30ch",
            textAlign: "center",
            fontSize: "14pt",
            height: "28px"
          }}
          autoComplete="off"
        ></input>
        <button
          className="boton"
          onClick={e => {
            props.changeVod(document.getElementById("inputVod").value.trim());
            props.setEditing(null);
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
