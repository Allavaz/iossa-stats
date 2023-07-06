import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import router from "next/router";
import { useEffect, useState } from "react";
import Challonge from "../../components/challonge";
import MatchCard from "../../components/matchCard";
import MatchIndividualStats from "../../components/matchIndividualStats";
import MatchTeamStats from "../../components/matchTeamStats";
import PositionsComponent from "../../components/positions";
import Vod from "../../components/vod";
import VodEditor from "../../components/vodEditor";
import createJSON from "../../lib/createJSON";
import { getMatch, getPlayers, getPositions } from "../../lib/getFromDB";
import { Match, MatchEvent, MatchPlayer } from "../../types";
import Torneos from "../../utils/Torneos.json";
import Title from "../../components/commons/title";
import Card from "../../components/commons/card";
import Button from "../../components/commons/button";

export const getServerSideProps: GetServerSideProps = async context => {
  let props: any = {};
  let match = await getMatch(context.params.id[0]);
  if (match) {
    props.data = match;
    for (let i in Torneos) {
      for (let j in Torneos[i].torneos) {
        let t: any = Torneos[i].torneos[j];
        if (t.torneo === match.torneo) {
          if (t.challonge) {
            props.challonge = t.challonge;
          } else if (t.tabla) {
            props.table = await getPositions(t.tabla);
            props.tablaTorneo = t.tablaLabel || t.torneo;
          }
        }
      }
    }
    if (context.params.id.length === 2) {
      if (context.params.id[1] === process.env.ENDPOINT) {
        props.players = await getPlayers("mini");
        props.editable = true;
      } else {
        return { notFound: true };
      }
    } else if (context.params.id.length > 2) {
      return { notFound: true };
    }
    return { props };
  } else {
    return { notFound: true };
  }
};

const blankMatch: Match = {
  filename: "",
  fecha: new Date().toISOString(),
  torneo: "Torneo",
  vod: null,
  teams: [
    {
      teamname: "Local",
      side: "home",
      score: 0,
      scorereceived: 0,
      result: 0,
      statistics: {
        shots: 0,
        shotsontarget: 0,
        possession: 50,
        passes: 0,
        passescompleted: 0,
        fouls: 0,
        yellowcards: 0,
        redcards: 0,
        offsides: 0,
        corners: 0,
        throwins: 0,
        penalties: 0,
        freekicks: 0,
        foulssuffered: 0,
        goalsconceded: 0,
        interceptions: 0,
        owngoals: 0,
        tackles: 0,
        tacklescompleted: 0,
        saves: 0,
        savescaught: 0,
        distancecovered: 0,
        assists: 0,
        goalkicks: 0,
        keypasses: 0,
        chancescreated: 0,
        secondassists: 0
      },
      playerStatistics: []
    },
    {
      teamname: "Visitante",
      side: "away",
      score: 0,
      scorereceived: 0,
      result: 0,
      statistics: {
        shots: 0,
        shotsontarget: 0,
        possession: 50,
        passes: 0,
        passescompleted: 0,
        fouls: 0,
        yellowcards: 0,
        redcards: 0,
        offsides: 0,
        corners: 0,
        throwins: 0,
        penalties: 0,
        freekicks: 0,
        foulssuffered: 0,
        goalsconceded: 0,
        interceptions: 0,
        owngoals: 0,
        tackles: 0,
        tacklescompleted: 0,
        saves: 0,
        savescaught: 0,
        distancecovered: 0,
        assists: 0,
        goalkicks: 0,
        keypasses: 0,
        chancescreated: 0,
        secondassists: 0
      },
      playerStatistics: []
    }
  ],
  players: [],
  matchevents: []
};

export default function MatchPage({
  data,
  table,
  tablaTorneo,
  challonge,
  editable,
  players,
  create
}) {
  const [editableData, setEditableData] = useState(
    create
      ? [JSON.parse(JSON.stringify(blankMatch))]
      : [JSON.parse(JSON.stringify(data))]
  );
  const [editableTable, setEditableTable] = useState(
    table ? JSON.parse(JSON.stringify(table)) : null
  );
  const [editableTablaHeader, setEditableTablaHeader] = useState(
    create ? "" : tablaTorneo
  );
  const [editableChallonge, setEditableChallonge] = useState(challonge);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  function changeTorneo(torneo: string) {
    setEditableTable(null);
    setEditableChallonge(null);
    setEditableData(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      data.torneo = torneo;
      return [...prevState, data];
    });
    updateTableOrChallonge(torneo);
  }

  useEffect(() => {
    window.onbeforeunload = (e: BeforeUnloadEvent) => {
      if (editableData && editableData.length > 1) {
        e = e || window.event;
        if (e) {
          e.returnValue = "Sure?";
        }
        return "Sure?";
      }
    };
  }, [editableData]);

  function updateTableOrChallonge(torneo: string) {
    for (let i in Torneos) {
      for (let j in Torneos[i].torneos) {
        let t: any = Torneos[i].torneos[j];
        if (t.torneo === torneo) {
          if (t.challonge) {
            setEditableChallonge(t.challonge);
          } else if (t.tabla) {
            axios.get("/api/positions/" + t.tabla).then(res => {
              setEditableTablaHeader(t.tablaLabel || t.torneo);
              setEditableTable(res.data);
            });
          }
        }
      }
    }
  }

  function changeDate(date: string) {
    setEditableData(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      data.fecha = date;
      return [...prevState, data];
    });
  }

  function changeTeam(newName: string, side: "home" | "away") {
    let s = side === "home" ? 0 : 1;
    setEditableData(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      data.teams[s].teamname = newName;
      for (let i in data.teams[s].playerStatistics) {
        data.teams[s].playerStatistics[i].info.team = newName;
        for (let j in data.players) {
          if (
            data.teams[s].playerStatistics[i].info.steam_id ===
            data.players[j].info.steam_id
          ) {
            data.players[j].info.team = newName;
          }
        }
      }
      return [...prevState, data];
    });
  }

  function changeScore(home: number, away: number) {
    setEditableData(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      data.teams[0].score = home;
      data.teams[1].score = away;
      data.teams[0].scorereceived = away;
      data.teams[1].scorereceived = home;
      if (data.teams[0].score > data.teams[1].score) {
        data.teams[0].result = 1;
        data.teams[1].result = -1;
      } else if (data.teams[1].score > data.teams[0].score) {
        data.teams[1].result = 1;
        data.teams[0].result = -1;
      } else {
        data.teams[0].result = 0;
        data.teams[1].result = 0;
      }
      return [...prevState, data];
    });
  }

  function changeEvents(matchEvents: MatchEvent[]) {
    setEditableData(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      data.matchevents = matchEvents;
      return [...prevState, data];
    });
    predictIndivStats();
    predictTeamStats();
  }

  function predictTeamStats() {
    setEditableData(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      let events = data.matchevents;
      let homeScore = 0;
      let awayScore = 0;
      let homeGoals = 0;
      let awayGoals = 0;
      let homeAssists = 0;
      let awayAssists = 0;
      let homeSecondAssists = 0;
      let awaySecondAssists = 0;
      let homeYellowCards = 0;
      let homeRedCards = 0;
      let homeSecondYellows = 0;
      let awaySecondYellows = 0;
      let awayYellowCards = 0;
      let awayRedCards = 0;
      let homeFouls = 0;
      let awayFouls = 0;
      let homePasses = 0;
      let awayPasses = 0;
      let homePassesCompleted = 0;
      let awayPassesCompleted = 0;
      let homeKeyPasses = 0;
      let awayKeyPasses = 0;
      let homeOffsides = 0;
      let awayOffsides = 0;
      let homeCorners = 0;
      let awayCorners = 0;
      let homeShots = 0;
      let awayShots = 0;
      let homeShotsOnTarget = 0;
      let awayShotsOnTarget = 0;
      let homeChancesCreated = 0;
      let awayChancesCreated = 0;
      for (let i in events) {
        if (events[i].team === "home") {
          switch (events[i].event) {
            case "GOAL":
              homeScore++;
              homeGoals++;
              break;
            case "YELLOW CARD":
              homeYellowCards++;
              break;
            case "RED CARD":
              homeRedCards++;
              break;
            case "SECOND YELLOW":
              homeSecondYellows++;
              break;
            case "OWN GOAL":
              awayScore++;
              break;
            default:
          }
        } else if (events[i].team === "away") {
          switch (events[i].event) {
            case "GOAL":
              awayScore++;
              awayGoals++;
              break;
            case "YELLOW CARD":
              awayYellowCards++;
              break;
            case "RED CARD":
              awayRedCards++;
              break;
            case "SECOND YELLOW":
              awaySecondYellows++;
              break;
            case "OWN GOAL":
              homeScore++;
              break;
            default:
          }
        }
      }
      for (let i in data.teams[0].playerStatistics) {
        homeAssists =
          homeAssists +
          (parseInt(data.teams[0].playerStatistics[i].statistics.assists) || 0);
        homeSecondAssists =
          homeSecondAssists +
          (parseInt(
            data.teams[0].playerStatistics[i].statistics.secondassists
          ) || 0);
        homeShots =
          homeShots +
          (parseInt(data.teams[0].playerStatistics[i].statistics.shots) || 0);
        homeShotsOnTarget =
          homeShotsOnTarget +
          (parseInt(
            data.teams[0].playerStatistics[i].statistics.shotsontarget
          ) || 0);
        homeFouls =
          homeFouls +
          (parseInt(data.teams[0].playerStatistics[i].statistics.fouls) || 0);
        homePasses =
          homePasses +
          (parseInt(data.teams[0].playerStatistics[i].statistics.passes) || 0);
        homePassesCompleted =
          homePassesCompleted +
          (parseInt(
            data.teams[0].playerStatistics[i].statistics.passescompleted
          ) || 0);
        homeKeyPasses =
          homeKeyPasses +
          (parseInt(data.teams[0].playerStatistics[i].statistics.keypasses) ||
            0);
        homeOffsides =
          homeOffsides +
          (parseInt(data.teams[0].playerStatistics[i].statistics.offsides) ||
            0);
        homeCorners =
          homeCorners +
          (parseInt(data.teams[0].playerStatistics[i].statistics.corners) || 0);
        homeChancesCreated =
          homeChancesCreated +
          (parseInt(
            data.teams[0].playerStatistics[i].statistics.chancescreated
          ) || 0);
      }
      for (let i in data.teams[1].playerStatistics) {
        awayShots =
          awayShots +
          (parseInt(data.teams[1].playerStatistics[i].statistics.shots) || 0);
        awayShotsOnTarget =
          awayShotsOnTarget +
          (parseInt(
            data.teams[1].playerStatistics[i].statistics.shotsontarget
          ) || 0);
        awayFouls =
          awayFouls +
          (parseInt(data.teams[1].playerStatistics[i].statistics.fouls) || 0);
        awayPasses =
          awayPasses +
          (parseInt(data.teams[1].playerStatistics[i].statistics.passes) || 0);
        awayPassesCompleted =
          awayPassesCompleted +
          (parseInt(
            data.teams[1].playerStatistics[i].statistics.passescompleted
          ) || 0);
        awayKeyPasses =
          awayKeyPasses +
          (parseInt(data.teams[1].playerStatistics[i].statistics.keypasses) ||
            0);
        awayOffsides =
          awayOffsides +
          (parseInt(data.teams[1].playerStatistics[i].statistics.offsides) ||
            0);
        awayCorners =
          awayCorners +
          (parseInt(data.teams[1].playerStatistics[i].statistics.corners) || 0);
        awayChancesCreated =
          awayChancesCreated +
          (parseInt(
            data.teams[1].playerStatistics[i].statistics.chancescreated
          ) || 0);
      }
      data.teams[0].score = homeScore;
      data.teams[0].scorereceived = awayScore;
      data.teams[1].score = awayScore;
      data.teams[1].scorereceived = homeScore;
      if (homeScore > awayScore) {
        data.teams[0].result = 1;
        data.teams[1].result = -1;
      } else if (awayScore > homeScore) {
        data.teams[1].result = 1;
        data.teams[0].result = -1;
      } else {
        data.teams[0].result = 0;
        data.teams[1].result = 0;
      }
      data.teams[0].statistics.assists = homeAssists;
      data.teams[1].statistics.assists = awayAssists;
      data.teams[0].statistics.secondassists = homeSecondAssists;
      data.teams[1].statistics.secondassists = awaySecondAssists;
      data.teams[0].statistics.shots = homeShots;
      data.teams[1].statistics.shots = awayShots;
      data.teams[0].statistics.shotsontarget = homeShotsOnTarget;
      data.teams[1].statistics.shotsontarget = awayShotsOnTarget;
      data.teams[0].statistics.fouls = homeFouls;
      data.teams[1].statistics.fouls = awayFouls;
      data.teams[0].statistics.passes = homePasses;
      data.teams[1].statistics.passes = awayPasses;
      data.teams[0].statistics.passescompleted = homePassesCompleted;
      data.teams[1].statistics.passescompleted = awayPassesCompleted;
      data.teams[0].statistics.keypasses = homeKeyPasses;
      data.teams[1].statistics.keypasses = awayKeyPasses;
      data.teams[0].statistics.offsides = homeOffsides;
      data.teams[1].statistics.offsides = awayOffsides;
      data.teams[0].statistics.corners = homeCorners;
      data.teams[1].statistics.corners = awayCorners;
      data.teams[0].statistics.chancescreated = homeChancesCreated;
      data.teams[1].statistics.chancescreated = awayChancesCreated;
      data.teams[0].statistics.yellowcards =
        homeYellowCards + homeSecondYellows;
      data.teams[1].statistics.yellowcards =
        awayYellowCards + awaySecondYellows;
      data.teams[0].statistics.redcards = homeRedCards + homeSecondYellows;
      data.teams[1].statistics.redcards = awayRedCards + homeSecondYellows;
      if (
        data.teams[0].statistics.fouls <
        homeYellowCards + homeRedCards + homeSecondYellows
      ) {
        data.teams[0].statistics.fouls =
          homeYellowCards + homeRedCards + homeSecondYellows;
      }
      if (
        data.teams[1].statistics.fouls <
        awayYellowCards + awayRedCards + awaySecondYellows
      ) {
        data.teams[1].statistics.fouls =
          awayYellowCards + awayRedCards + awaySecondYellows;
      }
      if (data.teams[0].statistics.shots < homeGoals) {
        data.teams[0].statistics.shots = homeGoals;
      }
      if (data.teams[0].statistics.shotsontarget < homeGoals) {
        data.teams[0].statistics.shotsontarget = homeGoals;
      }
      if (data.teams[1].statistics.shots < awayGoals) {
        data.teams[1].statistics.shots = awayGoals;
      }
      if (data.teams[1].statistics.shotsontarget < awayGoals) {
        data.teams[1].statistics.shotsontarget = awayGoals;
      }
      return prevState.map((_, i) =>
        i === prevState.length - 1 ? data : prevState[i]
      );
    });
  }

  function predictIndivStats() {
    setEditableData(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      let events = data.matchevents;
      let steamids = [];
      let homePlayerStatistics = data.teams[0].playerStatistics;
      let awayPlayerStatistics = data.teams[1].playerStatistics;
      let playerStatistics = data.players;
      for (let i in homePlayerStatistics) {
        homePlayerStatistics[i].statistics.goals = 0;
        homePlayerStatistics[i].statistics.owngoals = 0;
        homePlayerStatistics[i].statistics.yellowcards = 0;
        homePlayerStatistics[i].statistics.redcards = 0;
      }
      for (let i in awayPlayerStatistics) {
        awayPlayerStatistics[i].statistics.goals = 0;
        awayPlayerStatistics[i].statistics.owngoals = 0;
        awayPlayerStatistics[i].statistics.yellowcards = 0;
        awayPlayerStatistics[i].statistics.redcards = 0;
      }
      for (let i in playerStatistics) {
        playerStatistics[i].statistics.goals = 0;
        playerStatistics[i].statistics.owngoals = 0;
        playerStatistics[i].statistics.yellowcards = 0;
        playerStatistics[i].statistics.redcards = 0;
      }
      for (let i in events) {
        if (!steamids.includes(events[i].player1SteamId)) {
          steamids.push({
            steamid: events[i].player1SteamId,
            side: events[i].team,
            name: events[i].name
          });
        }
        if (
          events[i].player2SteamId &&
          !steamids.includes(events[i].player2SteamId)
        ) {
          steamids.push({
            steamid: events[i].player2SteamId,
            side: events[i].team,
            name: events[i].name2
          });
        }
        if (
          events[i].player3SteamId &&
          !steamids.includes(events[i].player3SteamId)
        ) {
          steamids.push({
            steamid: events[i].player3SteamId,
            side: events[i].team,
            name: events[i].name3
          });
        }
      }
      for (let i in steamids) {
        let found = false;
        for (let j in homePlayerStatistics) {
          if (steamids[i].steamid === homePlayerStatistics[j].info.steam_id) {
            found = true;
            predictPlayerStats(homePlayerStatistics[j], prevState.at(-1));
          }
        }
        for (let j in awayPlayerStatistics) {
          if (steamids[i].steamid === awayPlayerStatistics[j].info.steam_id) {
            found = true;
            predictPlayerStats(awayPlayerStatistics[j], prevState.at(-1));
          }
        }
        for (let j in playerStatistics) {
          if (steamids[i].steamid === playerStatistics[j].info.steam_id) {
            found = true;
            predictPlayerStats(playerStatistics[j], prevState.at(-1));
          }
        }
        if (!found) {
          let player: MatchPlayer = {
            info: {
              name: steamids[i].name,
              steam_id: steamids[i].steamid,
              team: ""
            },
            statistics: {
              assists: 0,
              corners: 0,
              distancecovered: 0,
              fouls: 0,
              foulssuffered: 0,
              freekicks: 0,
              goalkicks: 0,
              goals: 0,
              goalsconceded: 0,
              interceptions: 0,
              offsides: 0,
              owngoals: 0,
              passes: 0,
              passescompleted: 0,
              penalties: 0,
              positions: [],
              possession: 0,
              redcards: 0,
              saves: 0,
              savescaught: 0,
              secondsplayed: 0,
              shots: 0,
              shotsontarget: 0,
              tackles: 0,
              tacklescompleted: 0,
              throwins: 0,
              yellowcards: 0,
              keypasses: 0,
              chancescreated: 0,
              secondassists: 0
            }
          };
          if (steamids[i].side === "home") {
            player.info.team = data.teams[0].teamname;
            predictPlayerStats(player, prevState.at(-1));
            homePlayerStatistics.push(player);
          } else if (steamids[i].side === "away") {
            player.info.team = data.teams[1].teamname;
            predictPlayerStats(player, prevState.at(-1));
            awayPlayerStatistics.push(player);
          }
          playerStatistics.push(player);
        }
      }
      data.teams[0].playerStatistics = homePlayerStatistics;
      data.teams[1].playerStatistics = awayPlayerStatistics;
      data.players = playerStatistics;
      return prevState.map((_, i) =>
        i === prevState.length - 1 ? data : prevState[i]
      );
    });
  }

  function predictPlayerStats(player: MatchPlayer, prevState: Match) {
    const events = prevState.matchevents;
    Object.assign(
      player.statistics,
      events.reduce(
        (acc, item) => {
          if (item.player1SteamId === player.info.steam_id) {
            switch (item.event) {
              case "GOAL":
                acc.goals += 1;
                break;
              case "OWN GOAL":
                acc.owngoals += 1;
                break;
              case "YELLOW CARD":
                acc.yellowcards += 1;
                break;
              case "SECOND YELLOW":
                acc.yellowcards += 1;
                acc.redcards += 1;
                break;
              case "RED CARD":
                acc.redcards += 1;
                break;
              default:
            }
          } else if (
            item.player2SteamId === player.info.steam_id &&
            item.event === "GOAL"
          ) {
            acc.assists += 1;
          } else if (
            item.player3SteamId === player.info.steam_id &&
            item.event === "GOAL"
          ) {
            acc.secondassists += 1;
          }
          return acc;
        },
        {
          goals: 0,
          owngoals: 0,
          yellowcards: 0,
          redcards: 0,
          assists: 0,
          secondassists: 0
        }
      )
    );
    if (
      player.statistics.fouls <
      player.statistics.yellowcards + player.statistics.redcards
    ) {
      player.statistics.fouls =
        player.statistics.yellowcards + player.statistics.redcards;
    }
    if (player.statistics.goals > player.statistics.shots) {
      player.statistics.shots = player.statistics.goals;
    }
    if (player.statistics.goals > player.statistics.shotsontarget) {
      player.statistics.shotsontarget = player.statistics.goals;
    }
    events.forEach((e: MatchEvent) => {
      if (e.player1SteamId === player.info.steam_id) {
        player.info.name = e.name;
      }
    });
  }

  function changeVod(vod: string) {
    setEditableData(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      data.vod = vod;
      return [...prevState, data];
    });
  }

  function changeIndivStats(
    player: MatchPlayer,
    side: "home" | "away",
    index: number,
    oldsteamid: string
  ) {
    setEditableData(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      let s = side === "home" ? 0 : 1;
      data.teams[s].playerStatistics[index] = player;
      let playerExists = false;
      let steamidlookup: string;
      if (oldsteamid) steamidlookup = oldsteamid;
      else steamidlookup = player.info.steam_id;
      for (let i in data.players) {
        if (data.players[i].info.steam_id === steamidlookup) {
          data.players[i] = player;
          playerExists = true;
        }
      }
      if (!playerExists) {
        data.players.push(player);
      }
      for (let i in data.matchevents) {
        if (data.matchevents[i].player1SteamId === steamidlookup) {
          data.matchevents[i].name = player.info.name;
          data.matchevents[i].player1SteamId = player.info.steam_id;
        }
      }
      return [...prevState, data];
    });
    predictTeamStats();
  }

  function removePlayer(
    player: MatchPlayer,
    side: "home" | "away",
    index: number
  ) {
    setEditableData(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      let s = side === "home" ? 0 : 1;
      data.teams[s].playerStatistics.splice(index, 1);
      for (let i in data.players) {
        if (data.players[i].info.steam_id === player.info.steam_id) {
          data.players.splice(i, 1);
        }
      }
      data.matchevents = data.matchevents.filter(
        (event: MatchEvent) => event.player1SteamId !== player.info.steam_id
      );
      return [...prevState, data];
    });
    predictTeamStats();
  }

  function exportMatch() {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(editableData.at(-1))], {
      type: "application/json"
    });
    element.href = URL.createObjectURL(file);
    element.download = editableData.at(-1).filename;
    document.body.appendChild(element);
    element.click();
  }

  function restartEditing() {
    setEditableData([JSON.parse(JSON.stringify(data))]);
    setEditing(null);
  }

  function updateMatch(password: string) {
    if (editableData.at(-1).torneo === "Torneo") {
      alert("Te faltó elegir el torneo!");
    } else if (editing) {
      alert("Hay cambios sin guardar!");
    } else if (password === "") {
      alert("Ingrese la contraseña.");
    } else if (
      editableData.at(-1).teams[0].statistics.possession +
        editableData.at(-1).teams[1].statistics.possession !==
      100
    ) {
      alert("Las posesiones están desbalanceadas. Revisá las cuentas.");
    } else {
      setLoading(true);
      axios
        .post(`/api/post${create ? "upload" : "update"}`, {
          password: password,
          data: editableData.at(-1)
        })
        .then(res => {
          if (res.data === "wrong pw") {
            alert("Contraseña incorrecta!");
          } else if (res.data.status === "Success!") {
            if (create) {
              setEditableData(old =>
                old.map((e, i) => {
                  if (i === old.length - 1) {
                    return { ...e, _id: res.data.id };
                  } else {
                    return { e };
                  }
                })
              );
            }
            setSuccess("updating");
          } else {
            alert("Ocurrió un error. Revisá la consola.");
          }
          setLoading(false);
        })
        .catch(e => console.error(e));
    }
  }

  function deleteMatch(password: string) {
    if (password === "") {
      alert("Ingrese la contraseña.");
    } else {
      setLoading(true);
      axios
        .post("/api/postdelete", {
          password: password,
          data: editableData.at(-1)
        })
        .then(res => {
          if (res.data === "wrong pw") {
            alert("Contraseña incorrecta!");
          } else if (res.data === "Success!") {
            setSuccess("deleting");
          } else {
            alert("Ocurrió un error. Revisá la consola.");
          }
          setLoading(false);
        })
        .catch(e => console.error(e));
    }
  }

  function undo() {
    setEditing(null);
    setEditableData(prevState =>
      prevState.filter((_, i) => i !== prevState.length - 1)
    );
  }

  function dropFile(ev: React.DragEvent) {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      if (
        ev.dataTransfer.items.length == 1 &&
        ev.dataTransfer.items[0].kind === "file"
      ) {
        let file = ev.dataTransfer.items[0].getAsFile();
        try {
          let lastData = editableData.at(-1);
          file.text().then(res => {
            let json = JSON.parse(res);
            let doc = createJSON(
              json,
              lastData.torneo,
              lastData.vod,
              file.name
            );
            setEditableData(old => [...old, doc]);
          });
        } catch (error) {
          alert("Archivo inválido. Intentá con otro.");
          console.error(error);
        }
      }
    }
  }

  if (success === "updating") {
    return (
      <div className="m-auto w-fit">
        <Card>
          <div className="flex flex-col items-center gap-y-4 p-10">
            <FontAwesomeIcon
              icon={faCheckCircle}
              color="--var(header-color)"
              size="5x"
            />
            <div>Partido {create ? "subido" : "modificado"} correctamente.</div>
            <div>
              <Button
                onClick={_ => {
                  router.push("/partido/" + editableData.at(-1)._id);
                  setSuccess(null);
                }}
              >
                Ir al partido
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  } else if (success === "deleting") {
    return (
      <div className="m-auto w-fit">
        <Card>
          <div className="flex flex-col items-center gap-y-4 p-10">
            <FontAwesomeIcon
              icon={faCheckCircle}
              color="--var(header-color)"
              size="5x"
            />
            <div>Partido eliminado correctamente.</div>
            <Button onClick={_ => router.push("/")}>Volver al inicio</Button>
          </div>
        </Card>
      </div>
    );
  } else {
    return (
      <>
        <Head>
          <title>
            {create
              ? "Subir partido | IOSoccer Sudamérica"
              : `${data.teams[0].teamname} ${data.teams[0].score} - ${data.teams[1].score} ${data.teams[1].teamname} | IOSoccer
            Sudamérica`}
          </title>
          {!create && (
            <>
              <meta property="og:type" content="website" />
              <meta
                property="og:title"
                content={`${data.teams[0].teamname} ${data.teams[0].score} - ${data.teams[1].score} ${data.teams[1].teamname}`}
              />
              <meta
                property="og:image"
                content={"https://iosoccer-sa.bid/api/matchcard/" + data._id}
              />
              <meta property="og:site_name" content="IOSoccer Sudamérica" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta
                name="twitter:title"
                content={`${data.teams[0].teamname} vs. ${data.teams[1].teamname} | IOSoccer Sudamérica`}
              />
              <meta
                name="twitter:image:src"
                content={"https://iosoccer-sa.bid/api/matchcard/" + data._id}
              />
              <meta name="twitter:site" content="@IOSoccerSA" />
            </>
          )}
        </Head>
        <div className="flex flex-col gap-y-4">
          <MatchCard
            data={editable || create ? editableData.at(-1) : data}
            editable={editable || create}
            players={players}
            changeTorneo={changeTorneo}
            changeDate={changeDate}
            changeTeam={changeTeam}
            changeScore={changeScore}
            changeEvents={changeEvents}
            loading={loading}
            exportMatch={exportMatch}
            restartEditing={restartEditing}
            updateMatch={updateMatch}
            deleteMatch={deleteMatch}
            editing={editing}
            setEditing={setEditing}
            undo={undo}
            disableUndo={editableData.length < 2}
            create={create}
            dropFile={dropFile}
          />
          <div className="flex flex-wrap justify-center gap-4">
            <div className="max-w-xl grow">
              <MatchTeamStats
                data={editable || create ? editableData.at(-1) : data}
              />
            </div>
            {(editableChallonge || (challonge && !(editable || create))) && (
              <>
                <Title>
                  {editableChallonge ? editableData.at(-1).torneo : data.torneo}
                </Title>
                <Challonge id={editableChallonge || challonge} />
              </>
            )}
            {editableTable || (table && !editable) ? (
              <div className="flex grow flex-col gap-y-2 overflow-x-auto">
                <PositionsComponent
                  teams={editable || create ? editableTable : table}
                  header={
                    editable || create ? editableTablaHeader : tablaTorneo
                  }
                />
                {editable || create ? (
                  <div className="text-sm italic text-neutral-500 dark:text-neutral-400">
                    La tabla se actualizará luego de subir el partido.
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <MatchIndividualStats
            players={
              editable || create
                ? editableData.at(-1).teams[0].playerStatistics
                : data.teams[0].playerStatistics
            }
            teamName={
              editable || create
                ? editableData.at(-1).teams[0].teamname
                : data.teams[0].teamname
            }
            editable={editable || create}
            playersAutocomplete={players}
            changeIndivStats={changeIndivStats}
            removePlayer={removePlayer}
            side="home"
            editing={editing}
            setEditing={setEditing}
          />
          <MatchIndividualStats
            players={
              editable || create
                ? editableData.at(-1).teams[1].playerStatistics
                : data.teams[1].playerStatistics
            }
            teamName={
              editable || create
                ? editableData.at(-1).teams[1].teamname
                : data.teams[1].teamname
            }
            editable={editable || create}
            playersAutocomplete={players}
            changeIndivStats={changeIndivStats}
            removePlayer={removePlayer}
            side="away"
            editing={editing}
            setEditing={setEditing}
          />
          {(!(editable || create) && data.vod) ||
          ((editable || create) &&
            editableData.at(-1).vod &&
            editing !== "vod") ? (
            <Vod
              vod={editable || create ? editableData.at(-1).vod : data.vod}
              editable={editable || create}
              setEditing={setEditing}
              changeVod={changeVod}
            />
          ) : null}
          {(editableData.at(-1).vod === null && (editable || create)) ||
          editing === "vod" ? (
            <VodEditor
              vod={editableData.at(-1).vod}
              changeVod={changeVod}
              setEditing={setEditing}
            />
          ) : null}
        </div>
      </>
    );
  }
}
