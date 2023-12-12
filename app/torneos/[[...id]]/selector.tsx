"use client";

import { useRouter } from "next/navigation";
import Torneos from "../../../utils/Torneos.json";
import Select from "../../../components/ui/select";

function getCategory(arg: string) {
  if (arg === "all") {
    return "Totales";
  } else if (arg.startsWith("t")) {
    return "Temporada " + arg.replace("t", "");
  } else if (arg === "selecciones") {
    return "Selecciones";
  } else {
    for (let i in Torneos) {
      for (let j in Torneos[i].torneos) {
        if (arg === Torneos[i].torneos[j].query) {
          return Torneos[i].torneos[j].torneo;
        }
      }
    }
  }
}

function getTemporada(arg: string) {
  if (arg.startsWith("t") || arg === "all" || arg === "selecciones") {
    return arg;
  } else {
    for (let i in Torneos) {
      for (let j in Torneos[i].torneos) {
        if (arg === Torneos[i].torneos[j].query) {
          return Torneos[i].temporada;
        }
      }
    }
  }
  if (document.getElementById("selector")) {
    let selector = document.getElementById("selector") as HTMLSelectElement;
    for (let i in selector.options) {
      if (selector.options[i].value === arg) {
        selector.selectedIndex = parseInt(i);
      }
    }
  }
}

export default function Selector({ temporada }) {
  const router = useRouter();

  function goToTemporada(id: string) {
    router.push("/torneos/" + id);
  }

  const hideTemporadas = ["all", "primerorden", "segundoorden", "tercerorden"];

  return (
    <Select
      defaultValue={temporada}
      onChange={e => goToTemporada(e.target.value)}
    >
      {Torneos.filter(e => !hideTemporadas.includes(e.temporada)).map(
        (item, index) => (
          <option key={index} value={item.temporada}>
            {item.titulo}
          </option>
        )
      )}
    </Select>
  );
}
