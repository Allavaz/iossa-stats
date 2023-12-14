import { useState } from "react";
import Button from "./commons/button";
import Title from "./commons/title";
import RulesPreview from "./rulesPreview";
import axios from "axios";
import SuccessRules from "./rulesSuccess";
import { useRouter } from "next/router";

export default function RulesEditor({ defaultValue }) {
  const [rules, setRules] = useState(defaultValue);
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function updateRules(rules: string, password: string) {
    setLoading(true);
    axios
      .post("/api/reglas", { rules, password })
      .then(() => setSuccess(true))
      .catch(err => {
        if (err.response.status === 401) {
          alert("Contraseña incorrecta");
        } else {
          alert("Error al actualizar las reglas");
        }
      });
  }

  if (success) return <SuccessRules />;

  return (
    <div className="flex flex-col gap-y-4">
      <Title>Editar reglas</Title>
      <textarea
        className="h-[60vh] w-full rounded-md border border-neutral-300 p-2 font-mono text-sm dark:border-neutral-700"
        defaultValue={defaultValue}
        onChange={e => setRules(e.target.value.trim())}
      />
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="text-sm italic text-neutral-500 dark:text-neutral-400">
          Es posible aplicar formato usando{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            href="https://www.markdownguide.org/cheat-sheet/#basic-syntax"
          >
            Markdown
          </a>
        </div>
        <div className="flex gap-x-2">
          <Button onClick={() => router.push(router.asPath + "/history")}>
            Historial de ediciones
          </Button>
          <input
            className="w-36 rounded-lg border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
            type="password"
            placeholder="Contraseña"
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            disabled={loading}
            onClick={() => updateRules(rules, password)}
          >
            Guardar
          </Button>
        </div>
      </div>
      <Title>Vista previa</Title>
      <RulesPreview rules={rules} date={new Date().toISOString()} />
    </div>
  );
}
