"use client";

import { useRouter } from "next/navigation";
import Select from "../../../components/ui/select";
import TorneosJSON from "../../../utils/Torneos.json";
import Link from "next/link";

function getTorneos() {
  const ignoredTorneos = ["america"];
  return TorneosJSON[0].torneos
    .filter(torneo => !ignoredTorneos.includes(torneo.query))
    .map(torneo => ({
      value: torneo.query,
      label: torneo.torneo
    }));
}

export default function TorneoSelect({ mobile, torneo }) {
  const router = useRouter();
  if (mobile) {
    return (
      <Select
        defaultValue={torneo}
        onChange={e => router.push(`/torneos/${e.target.value}`)}
      >
        {getTorneos().map(torneo => (
          <option key={torneo.value} value={torneo.value}>
            {torneo.label}
          </option>
        ))}
      </Select>
    );
  } else {
    return (
      <div className="flex h-fit flex-col rounded-lg border border-neutral-300 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-950">
        {getTorneos().map(torneo => (
          <Link
            className="whitespace-nowrap border-b border-neutral-300 p-3 transition-colors last:border-none hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
            key={torneo.value}
            href={`/torneos/${torneo.value}`}
          >
            {torneo.label}
          </Link>
        ))}
      </div>
    );
  }
}
