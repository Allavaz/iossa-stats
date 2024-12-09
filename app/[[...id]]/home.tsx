import Matches from "../../components/matches";
import PositionsComponent from "../../components/positions";

export default function Home({ matches, tablas }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:flex-nowrap">
      <div className="grow">
        <Matches matches={matches} />
      </div>
      {tablas.some(items => items.teams.length > 0) && (
        <div className="flex grow flex-col gap-y-4 sm:grow-0">
          {tablas.map(
            (item, index) =>
              item.teams.length > 0 && (
                <PositionsComponent
                  mini
                  teams={item.teams}
                  key={index}
                  header={item.name}
                />
              )
          )}
        </div>
      )}
    </div>
  );
}
