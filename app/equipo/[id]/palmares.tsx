import Link from "next/link";
import Card from "../../../components/ui/card";
import Title from "../../../components/ui/title";
import { getTorneoQuery, getTournamentIcon } from "../../../utils/Utils";

function sortTorneos(a, b) {
  const aTemporada = a.match(/.* T(\d+)/)[1];
  const bTemporada = b.match(/.* T(\d+)/)[1];
  return aTemporada - bTemporada;
}

export default function Palmares({ palmares }) {
  palmares.sort(sortTorneos);
  return (
    <div className="flex flex-col gap-4">
      <Title>Palmarés</Title>
      <Card>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {palmares.map(torneo => {
            const torneoName = torneo.match(/(.*) T\d+/)[1];
            const temporada = torneo.match(/.* T(\d+)/)[1];
            return (
              <div key={torneo} className="flex flex-col items-center gap-2">
                <img
                  className="h-20"
                  src={getTournamentIcon(torneo)}
                  alt={torneo}
                  title={torneo}
                />
                <div className="font-heading text-2xl text-neutral-600 dark:text-neutral-400">
                  <Link
                    href={`/torneos/${getTorneoQuery(
                      torneoName
                    )}/t${temporada}`}
                    key={temporada}
                  >
                    T{temporada}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
