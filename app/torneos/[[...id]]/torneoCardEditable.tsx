"use client";

import Card from "../../../components/ui/card";
import Title from "../../../components/ui/title";
import { getTeamLogo, getTournamentIcon } from "../../../utils/Utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import AutocompleteTeams from "../../partido/[[...id]]/autocompleteTeams";
import Button from "../../../components/ui/button";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

export default function TorneoCardEditable({
  torneoLabel,
  temporada,
  winners
}) {
  const [winner, setWinner] = useState(winners?.firstPlace || "Agregar equipo");
  const [editing, setEditing] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const updateChampion = async () => {
    setLoading(true);
    const torneo = torneoLabel + " " + temporada.toUpperCase();
    axios
      .post("/api/champion", {
        torneo,
        teamname: winner,
        password: password
      })
      .then(res => {
        if (res.data === "Success") {
          alert("Campeón actualizado!");
          router.push(pathname.split("/").slice(0, -1).join("/"));
        } else if (res.data === "wrong pw") {
          alert("Contraseña incorrecta");
          setLoading(false);
        } else {
          alert("Error");
          setLoading(false);
        }
      });
  };

  const deleteChampion = async () => {
    setLoading(true);
    const torneo = torneoLabel + " " + temporada.toUpperCase();
    axios
      .delete("/api/champion", {
        data: {
          torneo,
          password: password
        }
      })
      .then(res => {
        if (res.data === "Success") {
          alert("Campeón borrado!");
          router.push(pathname.split("/").slice(0, -1).join("/"));
        } else if (res.data === "wrong pw") {
          alert("Contraseña incorrecta");
          setLoading(false);
        } else {
          alert("Error");
          setLoading(false);
        }
      });
  };

  return (
    <Card>
      <div className="flex flex-col items-center justify-evenly gap-4 sm:flex-row">
        <div className="flex flex-col items-center justify-center gap-4">
          <img
            src={getTournamentIcon(torneoLabel)}
            alt={torneoLabel}
            className="w-[128px]"
          />
          <Title>
            {torneoLabel} - Temporada {temporada.replace("t", "")}
          </Title>
        </div>
        <div className="flex flex-col items-center gap-2">
          <img src={getTeamLogo(winner)} alt={winner} />
          {editing || !winner ? (
            <div className="flex flex-col items-center gap-4">
              <AutocompleteTeams defaultValue={winner} setValue={setWinner} />
              <input
                type="password"
                placeholder="Contraseña"
                className="rounded-lg border border-neutral-200 bg-white p-1 text-center shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
              />
              <div className="flex gap-2 text-sm">
                <Button
                  onClick={_ => updateChampion()}
                  disabled={loading || !password}
                >
                  Guardar
                </Button>
                <Button
                  onClick={_ => {
                    setEditing(false);
                    setWinner(winners?.firstPlace || "Agregar equipo");
                    setPassword("");
                  }}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                {winners?.firstPlace && (
                  <Button
                    disabled={loading || !password}
                    onClick={_ => deleteChampion()}
                  >
                    Borrar campeón
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 font-heading text-xl">
              <FontAwesomeIcon
                className="cursor-pointer"
                icon={faEdit}
                onClick={_ => setEditing(true)}
              />
              <span>{winner}</span>
            </div>
          )}
          {!editing && (
            <div className="text-neutral-500 dark:text-neutral-400">
              Campeón
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
