import { Match } from "../types";
import TeamsJSON from "./Teams.json";
import TorneosJSON from "./Torneos.json";
import { DateTime } from "luxon";

const temporadaRegex = /^t(\d+)/;
const ordenes = ["primerorden", "segundoorden", "tercerorden"];

export function getAllQueries() {
  let queries = [];
  for (let i in TorneosJSON) {
    queries.push(TorneosJSON[i].temporada);
    for (let j in TorneosJSON[i].torneos) {
      if (TorneosJSON[i].torneos[j].query) {
        queries.push(TorneosJSON[i].torneos[j].query);
      }
    }
  }
  return queries;
}

export function getTournamentIcon(tournament) {
  if (tournament.includes("Liga D1")) {
    return "/tournaments/ligad1.png";
  } else if (tournament.includes("Superliga D1")) {
    return "/tournaments/superligad1.png";
  } else if (tournament.includes("Liga D2")) {
    return "/tournaments/ligad2.png";
  } else if (tournament.includes("Liga D3")) {
    return "/tournaments/ligad3.png";
  } else if (tournament.includes("Liga D4")) {
    return "/tournaments/ligad4.png";
  } else if (tournament.includes("Copa Master")) {
    return "/tournaments/copamaster.png";
  } else if (tournament.includes("Recopa Master")) {
    return "/tournaments/recopamaster.png";
  } else if (tournament.includes("Recopa Maradei")) {
    return "/tournaments/recopamaradei.png";
  } else if (tournament.includes("Copa Maradei")) {
    return "/tournaments/copamaradei.png";
  } else if (tournament.includes("Copa America")) {
    return "/tournaments/copaamerica.png";
  } else if (tournament.includes("Supercopa Master")) {
    return "/tournaments/supercopamaster.png";
  } else if (tournament.includes("Copa del Sur")) {
    return "/tournaments/copadelsur.png";
  } else if (tournament.includes("Copa Gubero")) {
    return "/tournaments/cg.png";
  } else if (tournament.includes("Recopa Master T0")) {
    return "/tournaments/recopamastert0.png";
  } else if (tournament.includes("Liga Master")) {
    return "/tournaments/ligamaster.png";
  } else if (tournament.includes("Division de Honor")) {
    return "/tournaments/ddh.png";
  } else if (tournament.includes("Copa valencARc")) {
    return "/tournaments/copavalencarc.png";
  } else if (tournament.includes("Liga Zero")) {
    return "/tournaments/ligazero.png";
  } else {
    return "/logo-solo.png";
  }
}

export function plus(n) {
  if (n >= 0) {
    return "+" + n;
  } else {
    return n;
  }
}

export function fecha(ISODate: string) {
  return DateTime.fromISO(ISODate).toLocal().toFormat("dd/LL/yyyy");
}

export function fechaHora(ISODate: string) {
  const fecha = DateTime.fromISO(ISODate).toLocal().toFormat("dd/LL/yyyy");
  const hora = DateTime.fromISO(ISODate).toLocal().toFormat("HH:mm");
  return `${fecha} a las ${hora}`;
}

export function percentage(x, y) {
  if (y === 0) {
    return 0;
  } else {
    return Math.round((x / y) * 100);
  }
}

export function invPercentage(x, y) {
  return (x / 100) * y;
}

export function filterMethod(filter, row) {
  const id = filter.pivotId || filter.id;
  return row[id] !== undefined
    ? String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
    : true;
}

export function getTeamLogo(teamname: string) {
  try {
    let shortname = TeamsJSON[teamname].toLowerCase();
    return `/clubs/${shortname}.png`;
  } catch {
    return "/logo-iosoccer-128.png";
  }
}

export function getTeamShortname(teamname) {
  const shortname = TeamsJSON[teamname];
  if (shortname) {
    return shortname;
  } else {
    let len = Math.min(3, teamname.length);
    return teamname.substring(0, len).toUpperCase();
  }
}

export function getTablas(temp) {
  let tablas = [];
  for (let i in TorneosJSON) {
    if (TorneosJSON[i].temporada === temp) {
      for (let j in TorneosJSON[i].torneos) {
        if (
          TorneosJSON[i].torneos[j].tabla &&
          tablas.findIndex(e => e.table === TorneosJSON[i].torneos[j].tabla) ===
            -1
        ) {
          tablas.push({
            table: TorneosJSON[i].torneos[j].tabla,
            name: TorneosJSON[i].torneos[j].torneo
          });
        }
      }
    }
  }
  return tablas;
}

export function getTablasTorneo(torneo: string, temporada: string) {
  const fullid = torneo + temporada;
  let tablas = [];
  for (let i in TorneosJSON) {
    if (TorneosJSON[i].temporada === temporada) {
      for (let j in TorneosJSON[i].torneos) {
        if (
          TorneosJSON[i].torneos[j].tabla &&
          TorneosJSON[i].torneos[j].tabla.includes(fullid) &&
          tablas.findIndex(e => e.table === TorneosJSON[i].torneos[j].tabla) ===
            -1
        ) {
          tablas.push({
            table: TorneosJSON[i].torneos[j].tabla,
            name: TorneosJSON[i].torneos[j].torneo
          });
        }
      }
    }
  }
  return tablas;
}

export function getChallonges(temp) {
  let challonges = [];
  for (let i in TorneosJSON) {
    if (TorneosJSON[i].temporada === temp) {
      for (let j in TorneosJSON[i].torneos) {
        if (
          TorneosJSON[i].torneos[j].challonge &&
          challonges.findIndex(
            e => e.table === TorneosJSON[i].torneos[j].challonge
          ) === -1
        ) {
          challonges.push({
            challonge: TorneosJSON[i].torneos[j].challonge,
            name: TorneosJSON[i].torneos[j].torneo
          });
        }
      }
    }
  }
  return challonges;
}

export function getChallongeTorneo(header: string, temporada: string) {
  for (let i in TorneosJSON) {
    if (TorneosJSON[i].temporada === temporada) {
      for (let j in TorneosJSON[i].torneos) {
        if (
          TorneosJSON[i].torneos[j].challonge &&
          TorneosJSON[i].torneos[j].torneo.includes(header)
        ) {
          return {
            challonge: TorneosJSON[i].torneos[j].challonge,
            name: TorneosJSON[i].torneos[j].torneo
          };
        }
      }
    }
  }
}

export function getAllTemporadas() {
  let temps = [];
  for (let i in TorneosJSON) {
    if (!ordenes.includes(TorneosJSON[i].temporada)) {
      temps.push(TorneosJSON[i].temporada);
    }
  }
  return temps;
}

export function getTemporadas(torneo: string) {
  let temps = [];
  for (let i in TorneosJSON) {
    if ([...ordenes, "all", "selecciones"].includes(TorneosJSON[i].temporada)) {
      continue;
    }
    for (let j in TorneosJSON[i].torneos) {
      if (
        TorneosJSON[i].torneos[j].torneo.includes(torneo) &&
        !temps.includes(TorneosJSON[i].temporada)
      ) {
        temps.push(TorneosJSON[i].temporada);
      }
    }
  }
  return temps;
}

export function getTorneoLabel(query: string) {
  for (let i in TorneosJSON[0].torneos) {
    if (query === TorneosJSON[0].torneos[i].query) {
      return TorneosJSON[0].torneos[i].torneo;
    }
  }
}

export function getTorneoQuery(torneo: string) {
  for (let i in TorneosJSON[0].torneos) {
    if (TorneosJSON[0].torneos[i].torneo === torneo) {
      return TorneosJSON[0].torneos[i].query;
    }
  }
}

export function getCategory(arg) {
  if (arg === "all") {
    return "Totales";
  } else if (arg === "selecciones") {
    return "Selecciones";
  } else if (arg === "primerorden") {
    return "Primer Orden";
  } else if (arg === "segundoorden") {
    return "Segundo Orden";
  } else if (arg === "tercerorden") {
    return "Tercer Orden";
  } else if (arg.match(temporadaRegex)) {
    return "Temporada " + arg.match(temporadaRegex)[1];
  } else {
    for (let i in TorneosJSON) {
      for (let j in TorneosJSON[i].torneos) {
        if (arg === TorneosJSON[i].torneos[j].query) {
          return TorneosJSON[i].torneos[j].torneo;
        }
      }
    }
  }
}

export function getTemporada(arg) {
  const specialArguments = [
    "all",
    "selecciones",
    "primerorden",
    "segundoorden",
    "tercerorden"
  ];
  if (arg.match(temporadaRegex) || specialArguments.includes(arg)) {
    return arg;
  } else {
    for (let i in TorneosJSON) {
      for (let j in TorneosJSON[i].torneos) {
        if (arg === TorneosJSON[i].torneos[j].query) {
          return TorneosJSON[i].temporada;
        }
      }
    }
  }
  if (document.getElementById("selector")) {
    let selector = document.getElementById("selector") as HTMLSelectElement;
    for (let i in selector.options) {
      if (selector.options[i].value === arg) {
        selector.selectedIndex = parseInt(i);
      }
    }
  }
}

// Esto asume que en Torneos.json se ordenan las temporadas
// de la mas nueva a la mas vieja
export function temporadaActual() {
  for (let i in TorneosJSON) {
    if (temporadaRegex.test(TorneosJSON[i].temporada)) {
      return TorneosJSON[i].temporada;
    }
  }
}

export function buildBlankMatch(): Match {
  return {
    filename: "",
    fecha: new Date().toISOString(),
    torneo: "Torneo",
    vod: null,
    isdefault: false,
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
}
