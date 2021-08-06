import { useState, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";
import { faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export async function getStaticPaths() {
  let paths = [
    { params: {id: process.env.ENDPOINT} }
  ]
  return { paths, fallback: false };
}

export async function getStaticProps() {
  return { props: {} };
}

const torneos = [
  'Liga D1 T7',
  'Liga D2 T7',
  "Copa valencARc T7",
  "Copa America '21 - Regular",
  "Copa America '21 - Playoff",
  //'Copa Maradei T7 - Grupo A',
  //'Copa Maradei T7 - Grupo B',
  //'Copa Maradei T7 - Grupo C',
  //'Copa Maradei T7 - Grupo D',
  //'Copa Maradei T7 - Eliminatorias',
  //'Superliga D1 T7',
  //"Superliga D1 T6",
  //"Copa valencARc T6",
  //'Liga D1 T6',
  //'Liga D2 T6',
  //'Copa Maradei T6 - Grupo A',
  //'Copa Maradei T6 - Grupo B',
  //'Copa Maradei T6 - Grupo C',
  //'Copa Maradei T6 - Eliminatorias',
  //	'Recopa Master T6',
  //	'Recopa Maradei T6',
  //	'Supercopa Master T6',
  //	'Division de Honor T5',
  //	'Liga Master T5',
  //	'Copa Master T5',
  //	'Copa Maradei T5 - Grupo A',
  //	'Copa Maradei T5 - Grupo B',
  //	'Copa Maradei T5 - Grupo C',
  //	'Copa Maradei T5 - Eliminatorias',
  //	'Recopa Master T5',
  //	'Recopa Maradei T5',
  //	'Supercopa Master T5',
  //	'Liga D1 T4',
  //	'Liga D2 T4',
  //	'Copa Gubero T4',
  //	'Liga D1 T4 - (Desempate)',
  //	'Liga D1 T4 - Promoción',
  //	'Division de Honor T0',
  //	'Liga Master T0',
  //	'Recopa Master T0',
  //	'Liga D1 T1',
  //	'Copa Maradei T1 - Grupo A',
  //	'Copa Maradei T1 - Grupo B',
  //	'Copa Maradei T1 - Grupo C',
  //	'Copa Maradei T1 - Eliminatorias',
  "Otro",
];

export default function Upload({}) {
  const router = useRouter();
  const [torneo, setTorneo] = useState(torneos[0]);
  const [pw, setPw] = useState(null);
  const [vod, setVod] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(0);
  const [cTor, setcTor] = useState(false);
  const bRef = useRef(null);
  const sRef = useRef(null);

  function submit(torneo, pw, vod, file) {
    let fd = new FormData();
    fd.append("torneo", torneo);
    fd.append("vod", vod);
    fd.append("pw", pw);
    if (file === null) {
      alert("No seleccionaste ningun archivo.");
    } else {
      bRef.current.disabled = true;
      sRef.current.style.display = "inline";
      for (let i = 0; i < file.length; i++) {
        fd.append("upload", file[i]);
      }
      axios
        .post("/api/postupload", fd)
        .then((res) => {
          if (res.data.status === "success") {
            setStatus(1);
          } else if (res.data === "Wrong Key") {
            alert("Contraseña incorrecta!");
            bRef.current.disabled = false;
            sRef.current.style.display = "none";
          } else {
            console.error(res.data.error);
            alert("Ocurrió un error. Revisá la consola.");
            bRef.current.disabled = false;
            sRef.current.style.display = "none";
          }
        })
        .catch((error) => {
          console.error(error);
          bRef.current.disabled = false;
          sRef.current.style.display = "none";
          alert("Ocurrió un error. Revisá la consola.");
        });
    }
  }

  function setTor(e) {
    if (e === "Otro") {
      setcTor(true);
    } else {
      setcTor(false);
      setTorneo(e);
    }
  }

  function reset() {
    setTorneo(torneos[0]);
    setVod("");
    setStatus(0);
    setcTor(false);
    setFile(null);
  }

  switch (status) {
    default:
      return (
        <>
          <Head>
            <title>Subir partido | IOSoccer Sudamérica</title>
          </Head>
          <div className="content">
            <div className="whitespace" style={{ padding: "0", width: "310px" }}>
              <div className="form">
                <h3 style={{ marginBottom: 0 }}>Cargar Partido</h3>
                <div>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFile(e.target.files)}
                    accept=".json"
                    style={{color: 'var(--normal-text-color)'}}
                  ></input>
                </div>
                <div>
                  <select
                    style={{ marginTop: 0, width: "260px" }}
                    id="selector"
                    name="torneo"
                    onChange={(e) => setTor(e.target.value)}
                  >
                    {torneos.map((e) => (
                      <option key={e} name="torneo" value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: cTor ? "block" : "none" }}>
                  <input
                    className="campo"
                    type="torneo"
                    onChange={(e) => setTorneo(e.target.value)}
                    size="24"
                    placeholder="Torneo"
                  ></input>
                </div>
                <div>
                  <input
                    className="campo"
                    type="text"
                    onChange={(e) => setVod(e.target.value)}
                    size="24"
                    placeholder="ID del VOD (Ej: lQMMnMvnMLk)"
                  ></input>
                </div>
                <div>
                  <input
                    className="campo"
                    type="password"
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="Contraseña"
                  ></input>
                </div>
                <div>
                  <button
                    className="boton"
                    ref={bRef}
                    onClick={() => submit(torneo, pw, vod, file)}
                  >
                    Enviar
                  </button>{" "}
                  <span ref={sRef} style={{ display: "none" }}>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      spin
                      color="#ff9800"
                    ></FontAwesomeIcon>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    case 1:
      return (
        <>
          <Head>
            <title>Carga exitosa | IOSoccer Sudamérica</title>
          </Head>
          <div className="content">
            <div
              className="whitespace"
              style={{
                padding: "0",
                width: "310px",
                textAlign: "center",
                minHeight: "355px",
              }}
            >
              <div className="cartel">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  color="--var(header-color)"
                  size="5x"
                ></FontAwesomeIcon>
                <div style={{ color: "--var(header-color)" }}>
                  Partido(s) cargado(s) correctamente.
                </div>
                <div>
                  <button style={{ margin: 0 }} className="boton" onClick={e => router.push('/resultados')}>
                    Resultados
                  </button>
                </div>
                <div>
                  <button
                    style={{ margin: 0 }}
                    className="boton"
                    onClick={() => reset()}
                  >
                    Cargar más
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
  }
}