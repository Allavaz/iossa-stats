"use client";

import { useRouter } from "next/navigation";
import Select from "../../../components/ui/select";

export default function TemporadaSelect({ temporadas, temporada, torneo }) {
  const router = useRouter();

  return (
    <Select
      defaultValue={temporada}
      onChange={e => router.push(`/torneos/${torneo}/${e.target.value}`)}
    >
      {temporadas.map((temporada, index) => (
        <option key={index} value={temporada}>
          Temporada {temporada.replace("t", "")}
        </option>
      ))}
    </Select>
  );
}
