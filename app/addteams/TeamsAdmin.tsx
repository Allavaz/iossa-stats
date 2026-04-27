"use client";

import { useState, useRef } from "react";
import type { TeamDoc } from "@/lib/getFromDB";
import Button from "@/components/ui/button";
import Table from "@/components/ui/table";
import Card from "@/components/ui/card";
import Title from "@/components/ui/title";

const inputClass =
  "rounded-md border border-neutral-300 p-2 dark:border-neutral-700 dark:bg-neutral-900";

export default function TeamsAdmin({
  initialTeams
}: {
  initialTeams: TeamDoc[];
}) {
  const [teams, setTeams] = useState<TeamDoc[]>(initialTeams);
  const [addName, setAddName] = useState("");
  const [addShortname, setAddShortname] = useState("");
  const [addFile, setAddFile] = useState<File | null>(null);
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const addFileRef = useRef<HTMLInputElement>(null);

  async function uploadLogo(
    file: File,
    shortname: string
  ): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("shortname", shortname);
    const res = await fetch("/api/teams/upload", { method: "POST", body: fd });
    if (!res.ok) return null;
    const { logofilename } = await res.json();
    return logofilename;
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    if (!addFile) {
      setAddError("Seleccioná una imagen.");
      return;
    }
    setAddLoading(true);
    try {
      const logofilename = await uploadLogo(addFile, addShortname);
      if (!logofilename) {
        setAddError("Error al subir la imagen.");
        return;
      }
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addName,
          shortname: addShortname,
          logofilename
        })
      });
      if (res.status === 409) {
        setAddError("Ya existe un equipo con ese nombre.");
        return;
      }
      if (!res.ok) {
        setAddError("Error al crear el equipo.");
        return;
      }
      const newTeam: TeamDoc = {
        name: addName,
        shortname: addShortname,
        logofilename
      };
      setTeams(prev =>
        [...prev, newTeam].sort((a, b) => a.name.localeCompare(b.name))
      );
      setAddName("");
      setAddShortname("");
      setAddFile(null);
      if (addFileRef.current) addFileRef.current.value = "";
    } finally {
      setAddLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Title>Agregar equipo</Title>
      <Card>
        <form onSubmit={handleAdd} className="flex max-w-sm flex-col gap-3">
          <input
            required
            value={addName}
            onChange={e => setAddName(e.target.value)}
            className={inputClass}
            placeholder="Nombre"
          />
          <input
            required
            value={addShortname}
            onChange={e => setAddShortname(e.target.value)}
            className={inputClass}
            maxLength={6}
            placeholder="Nombre corto"
          />
          <label className="flex items-center gap-2 text-sm">
            Logo:
            <input
              required
              type="file"
              accept="image/*"
              ref={addFileRef}
              onChange={e => setAddFile(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </label>
          {addError && <p className="text-sm text-red-500">{addError}</p>}
          <Button type="submit" disabled={addLoading}>
            {addLoading ? "Guardando..." : "Agregar"}
          </Button>
        </form>
      </Card>

      <Title>Equipos existentes</Title>
      <Table>
        <thead>
          <Table.HeaderRow>
            <Table.HeaderCell>Logo</Table.HeaderCell>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
            <Table.HeaderCell>Nombre corto</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.HeaderRow>
        </thead>
        <tbody>
          {teams.map(team => (
            <TeamRow
              key={team.name}
              team={team}
              onUpdate={updated =>
                setTeams(prev =>
                  prev.map(t => (t.name === updated.name ? updated : t))
                )
              }
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function TeamRow({
  team,
  onUpdate
}: {
  team: TeamDoc;
  onUpdate: (t: TeamDoc) => void;
}) {
  const [shortname, setShortname] = useState(team.shortname);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const logoUrl = `https://cdn.iosoccer-sa.com/clubs/${team.logofilename}`;

  async function uploadLogo(f: File, sn: string): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", f);
    fd.append("shortname", sn);
    const res = await fetch("/api/teams/upload", { method: "POST", body: fd });
    if (!res.ok) return null;
    const { logofilename } = await res.json();
    return logofilename;
  }

  async function handleSave() {
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      let logofilename = team.logofilename;
      if (file) {
        const uploaded = await uploadLogo(file, shortname);
        if (!uploaded) {
          setError("Error al subir la imagen.");
          return;
        }
        logofilename = uploaded;
      }
      const res = await fetch("/api/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: team.name, shortname, logofilename })
      });
      if (!res.ok) {
        setError("Error al guardar.");
        return;
      }
      onUpdate({ name: team.name, shortname, logofilename });
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } finally {
      setLoading(false);
    }
  }

  const dirty = shortname !== team.shortname || file !== null;

  return (
    <Table.BodyRow>
      <Table.BodyCell>
        <img
          src={logoUrl}
          alt={team.name}
          className="mx-auto h-8 w-8 object-contain"
        />
      </Table.BodyCell>
      <Table.BodyCell>{team.name}</Table.BodyCell>
      <Table.BodyCell>
        <input
          value={shortname}
          maxLength={6}
          onChange={e => setShortname(e.target.value)}
          className="w-20 rounded-md border border-neutral-300 p-1 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </Table.BodyCell>
      <Table.BodyCell>
        <div className="flex items-center justify-center gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={e => setFile(e.target.files?.[0] ?? null)}
            className="text-xs"
          />
          <Button onClick={handleSave} disabled={loading || !dirty}>
            {loading ? "..." : "Guardar"}
          </Button>
          {success && <span className="text-xs text-green-500">Guardado</span>}
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      </Table.BodyCell>
    </Table.BodyRow>
  );
}
