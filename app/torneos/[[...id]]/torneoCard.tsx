import Link from "next/link";
import Card from "../../../components/ui/card";
import Title from "../../../components/ui/title";
import { getTournamentIcon } from "../../../utils/Utils";

export default function TorneoCard({ torneoLabel, temporada, winners }: { torneoLabel: string; temporada: string; winners: any }) {
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
        {winners?.firstPlace && (
          <Link
            href={`/equipo/${winners.firstPlace}`}
            className="flex flex-col items-center gap-2"
          >
            <img
              src={winners.firstPlaceLogo || winners.firstPlaceLogo}
              alt={winners.firstPlace}
            />
            <div className="flex items-center gap-2 text-center font-heading text-xl">
              <span>{winners.firstPlace}</span>
            </div>
            <div className="text-neutral-500 dark:text-neutral-400">
              Campeón
            </div>
          </Link>
        )}
      </div>
    </Card>
  );
}
