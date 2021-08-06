var Teams = require('./Teams.json')
var Torneos = require('./Torneos.json');

exports.temporadaActual = 't7';

exports.getAllQueries = function() {
  let queries = []
  for (let i in Torneos) {
    queries.push(Torneos[i].temporada);
    for (let j in Torneos[i].torneos) {
      if (Torneos[i].torneos[j].query) {
        queries.push(Torneos[i].torneos[j].query);
      }
    }
  }
  return queries;
}

exports.getTournamentIcon = function (tournament) {
  if (tournament.includes("Liga D1")) {
    return "/tournaments/ligad1.png";
  } else if (tournament.includes("Superliga D1")) {
    return "/tournaments/superligad1.png";
  } else if (tournament.includes("Liga D2")) {
    return "/tournaments/ligad2.png";
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
  } else {
    return "/logo-solo.png";
  }
};

exports.plus = function (n) {
  if (n >= 0) {
    return "+" + n;
  } else {
    return n;
  }
};

exports.fecha = function (str) {
  var year = str.slice(0, 4);
  var month = str.slice(5, 7);
  var day = str.slice(8, 10);

  return day + "/" + month + "/" + year;
};

exports.percentage = function(x, y) {
  if (y === 0) {
    return 0;
  } else {
    return Math.round((x / y) * 100);
  }
};

exports.invPercentage = function(x, y) {
  return ((x/100) * y);
}

exports.filterMethod = (filter, row) => {
  const id = filter.pivotId || filter.id;
  return row[id] !== undefined
    ? String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
    : true;
};

exports.getTeamLogo = function(teamname) {
  try {
    let shortname = Teams[teamname].toLowerCase();
    return `/clubs/${shortname}.png`
  } catch {
    return '/logo-iosoccer-128.png'
  }
}

exports.getTeamShortname = function(teamname) {
  try {
    return Teams[teamname]
  } catch {
    let len = teamname.length > 3 ? 3 : teamname.length;
    return teamname.substring(0, len).toUpperCase()
  }
}
