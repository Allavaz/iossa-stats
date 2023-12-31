import Challonge from "../../../components/challonge";
import PositionsComponent from "../../../components/positions";
import Title from "../../../components/ui/title";
import MatchCard from "./matchCard";
import MatchIndividualStats from "./matchIndividualStats";
import MatchTeamStats from "./matchTeamStats";
import Vod from "./vod";

export default function MatchComponent({ match, table, challonge }) {
  return (
    <div className="flex flex-col gap-y-4">
      <MatchCard match={match} />
      <div className="flex flex-wrap justify-center gap-4">
        <div className="max-w-xl grow">
          <MatchTeamStats match={match} />
        </div>
        {challonge && (
          <>
            <Title>{match.torneo}</Title>
            <Challonge id={challonge} />
          </>
        )}
        {table ? (
          <div className="flex grow flex-col gap-y-2 overflow-x-auto">
            <PositionsComponent teams={table.positions} header={table.header} />
          </div>
        ) : null}
      </div>
      <MatchIndividualStats
        players={match.teams[0].playerStatistics}
        teamName={match.teams[0].teamname}
      />
      <MatchIndividualStats
        players={match.teams[1].playerStatistics}
        teamName={match.teams[1].teamname}
      />
      {match.vod && <Vod vod={match.vod} />}
    </div>
  );
}
