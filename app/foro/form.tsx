"use client";

import Button from "@/components/ui/button";
import { sendComment } from "./actions";
import Teams from "../../utils/Teams.json";
import { useRef } from "react";
import { useFormStatus } from "react-dom";

export default function Form() {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={
        (async formData => {
          await sendComment(formData);
          ref.current?.reset();
        }) as undefined as string
      }
    >
      <div className="flex flex-col gap-2">
        <div className="flex w-full flex-wrap justify-between gap-2">
          <input
            className="rounded-md border border-neutral-300 p-2 dark:border-neutral-700"
            placeholder="Nombre"
            maxLength={20}
            minLength={3}
            required={true}
            name="name"
          />
          <select
            className="rounded-md border border-neutral-300 p-2 dark:border-neutral-700"
            placeholder="Equipo"
            name="team"
            required={true}
          >
            {Object.keys(Teams).map(team => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <textarea
            className="h-36 w-full rounded-md border border-neutral-300 p-2 dark:border-neutral-700"
            placeholder="Mensaje"
            maxLength={1000}
            minLength={10}
            name="message"
            required={true}
          />
          <Submit />
        </div>
      </div>
    </form>
  );
}

function Submit() {
  const status = useFormStatus();
  return (
    <Button type="submit" disabled={status.pending}>
      Enviar
    </Button>
  );
}
