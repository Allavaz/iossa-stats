import MatchCard from "../../components/matchCard";
import { useState } from 'react';
import { getMatch, getPlayers, getPositions } from "../../lib/getFromDB";
import Head from 'next/head';
import MatchTeamStats from "../../components/matchTeamStats";
import FullPositions from "../../components/fullPositions";
import Torneos from '../../utils/Torneos.json';
import MatchIndividualStats from "../../components/matchIndividualStats";
import Vod from "../../components/vod";
import Challonge from '../../components/challonge';
import axios from "axios";
import VodEditor from "../../components/vodEditor";
import MatchTeamStatsEditor from "../../components/matchTeamStatsEditor";
import router from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export async function getServerSideProps(context) {
  let props = {};
  let match = await getMatch(context.params.id[0]);
  if (match) {
    props.data = JSON.parse(JSON.stringify(match));
    for (let i in Torneos) {
      for (let j in Torneos[i].torneos) {
        let t = Torneos[i].torneos[j];
        if (t.torneo === match.torneo) {
          if (t.challonge) {
            props.challonge = t.challonge
          } else if (t.tabla) {
            props.table = await getPositions(t.tabla);
            props.tablaTorneo = t.tablaLabel || t.torneo
          }
        }
      }
    }
    if (context.params.id.length === 2) {
      if (context.params.id[1] === process.env.ENDPOINT) {
        props.players = await getPlayers('all');
        props.editable = true;
      } else {
        return ({ notFound: true });
      }
    } else if (context.params.id.length > 2) {
      return ({ notFound: true });
    }
    return ({ props });
  } else {
    return ({ notFound: true });
  }
}

export default function Match({ data, table, tablaTorneo, challonge, editable, players }) {
  const [editableData, setEditableData] = useState(JSON.parse(JSON.stringify(data)));
  const [editableTable, setEditableTable] = useState(table ? JSON.parse(JSON.stringify(table)) : null);
  const [editableTablaTorneo, setEditableTablaTorneo] = useState(tablaTorneo);
  const [editableChallonge, setEditableChallonge] = useState(challonge);
  const [vodEditing, setVodEditing] = useState(false);
  const [teamStatsEditing, setTeamStatsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  function changeTorneo(torneo) {
    setEditableTable(null);
    setEditableChallonge(null);
    setEditableData((prevState) => ({...prevState, torneo: torneo}))
    for (let i in Torneos) {
      for (let j in Torneos[i].torneos) {
        let t = Torneos[i].torneos[j];
        if (t.torneo === torneo) {
          if (t.challonge) {
            setEditableChallonge(t.challonge);
          } else if (t.tabla) {
            axios.get('/api/positions/' + t.tabla).then((res) => {
              setEditableTable(res.data);
            })
            setEditableTablaTorneo(t.tablaLabel || t.torneo)
          }
        }
      }
    }
  }

  function changeDate(date) {
    setEditableData((prevState) => ({...prevState, fecha: date}));
  }

  function changeTeam(value, side) {
    let s = side === 'home' ? 0 : 1;
    setEditableData((prevState) => {
      let data = {...prevState};
      data.teams[s].teamname = value;
      for (let i in data.teams[s].playerStatistics) {
        data.teams[s].playerStatistics[i].info.team = value;
        for (let j in data.players) {
          if (data.teams[s].playerStatistics[i].info.steam_id === data.players[j].info.steam_id) {
            data.players[j].info.team = value;
          }
        }
      }
      return data;
    });
  }

  function changeScore(home, away) {
    setEditableData((prevState) => {
      let data = {...prevState};
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
      return data;
    });
  }

  function changeEvents(matchEvents) {
    setEditableData((prevState) => {
      let data = JSON.parse(JSON.stringify(prevState));
      data.matchevents = matchEvents;
      return data;
    })
    predictTeamStats();
    predictIndivStats();
  }

  function predictTeamStats() {
    setEditableData((prevState) => {
      let data = JSON.parse(JSON.stringify(prevState));
      let events = data.matchevents;
      let homeScore = 0;
      let awayScore = 0;
      let homeGoals = 0;
      let awayGoals = 0;
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
      let homeOffsides = 0;
      let awayOffsides = 0;
      let homeCorners = 0;
      let awayCorners = 0;
      let homeShots = 0;
      let awayShots = 0;
      let homeShotsOnTarget = 0;
      let awayShotsOnTarget = 0;
      for (let i in events) {
        if (events[i].team === 'home') {
          switch (events[i].event) {
            case 'GOAL':
              homeScore++;
              homeGoals++;
              break;
            case 'YELLOW CARD':
              homeYellowCards++;
              break;
            case 'RED CARD':
              homeRedCards++;
              break;
            case 'SECOND YELLOW':
              homeSecondYellows++;
              break;
            case 'OWN GOAL':
              awayScore++;
              break;
            default:
          }
        } else if (events[i].team === 'away') {
          switch (events[i].event) {
            case 'GOAL':
              awayScore++;
              awayGoals++;
              break;
            case 'YELLOW CARD':
              awayYellowCards++;
              break;
            case 'RED CARD':
              awayRedCards++;
              break;
            case 'SECOND YELLOW':
              awaySecondYellows++;
              break;
            case 'OWN GOAL':
              homeScore++;
              break;
            default:
          }
        }
      }
      for (let i in data.teams[0].playerStatistics) {
        homeShots = homeShots + parseInt(data.teams[0].playerStatistics[i].statistics.shots);
        homeShotsOnTarget = homeShotsOnTarget + parseInt(data.teams[0].playerStatistics[i].statistics.shotsontarget);
        homeFouls = homeFouls + parseInt(data.teams[0].playerStatistics[i].statistics.fouls);
        homePasses = homePasses + parseInt(data.teams[0].playerStatistics[i].statistics.passes);
        homePassesCompleted = homePassesCompleted + parseInt(data.teams[0].playerStatistics[i].statistics.passescompleted);
        homeOffsides = homeOffsides + parseInt(data.teams[0].playerStatistics[i].statistics.offsides);
        homeCorners = homeCorners + parseInt(data.teams[0].playerStatistics[i].statistics.corners);
      }
      for (let i in data.teams[1].playerStatistics) {
        awayShots = awayShots + parseInt(data.teams[1].playerStatistics[i].statistics.shots);
        awayShotsOnTarget = awayShotsOnTarget + parseInt(data.teams[1].playerStatistics[i].statistics.shotsontarget);
        awayFouls = awayFouls + parseInt(data.teams[1].playerStatistics[i].statistics.fouls);
        awayPasses = awayPasses + parseInt(data.teams[1].playerStatistics[i].statistics.passes);
        awayPassesCompleted = awayPassesCompleted + parseInt(data.teams[1].playerStatistics[i].statistics.passescompleted);
        awayOffsides = awayOffsides + parseInt(data.teams[1].playerStatistics[i].statistics.offsides);
        awayCorners = awayCorners + parseInt(data.teams[1].playerStatistics[i].statistics.corners);
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
      data.teams[0].statistics.offsides = homeOffsides;
      data.teams[1].statistics.offsides = awayOffsides;
      data.teams[0].statistics.corners = homeCorners;
      data.teams[1].statistics.corners = awayCorners;
      data.teams[0].statistics.yellowcards = homeYellowCards + homeSecondYellows;
      data.teams[1].statistics.yellowcards = awayYellowCards + awaySecondYellows;
      data.teams[0].statistics.redcards = homeRedCards + homeSecondYellows;
      data.teams[1].statistics.redcards = awayRedCards + homeSecondYellows;
      if (data.teams[0].statistics.fouls < (homeYellowCards + homeRedCards + homeSecondYellows)) {
        data.teams[0].statistics.fouls = homeYellowCards + homeRedCards + homeSecondYellows;
      } 
      if (data.teams[1].statistics.fouls < (awayYellowCards + awayRedCards + awaySecondYellows)) {
        data.teams[1].statistics.fouls = awayYellowCards + awayRedCards + awaySecondYellows;
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
      return data;
    })
  }

  function predictIndivStats() {
    setEditableData((prevState) => {
      let data = JSON.parse(JSON.stringify(prevState));
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
          steamids.push({steamid: events[i].player1SteamId, side: events[i].team, name: events[i].name});
        }
      }
      for (let i in steamids) {
        let found = false;
        for (let j in homePlayerStatistics) {
          if (steamids[i].steamid === homePlayerStatistics[j].info.steam_id) {
            found = true;
            predictPlayerStats(homePlayerStatistics[j]);
          }
        }
        for (let j in awayPlayerStatistics) {
          if (steamids[i].steamid === awayPlayerStatistics[j].info.steam_id) {
            found = true;
            predictPlayerStats(awayPlayerStatistics[j]);
          }
        }
        for (let j in playerStatistics) {
          if (steamids[i].steamid === playerStatistics[j].info.steam_id) {
            found = true;
            predictPlayerStats(playerStatistics[j]);
          }
        }
        if (!found) {
          let p = {
            info: {
              name: steamids[i].name,
              steam_id: steamids[i].steamid
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
              yellowcards: 0
            }
          }
          if (steamids[i].side === 'home') {
            p.info.team = data.teams[0].teamname
            predictPlayerStats(p);
            homePlayerStatistics.push(p);
          } else if (steamids[i].side === 'away') {
            p.info.team = data.teams[1].teamname
            predictPlayerStats(p);
            awayPlayerStatistics.push(p);
          }
          playerStatistics.push(p);
        }
      }
      data.teams[0].playerStatistics = homePlayerStatistics;
      data.teams[1].playerStatistics = awayPlayerStatistics;
      data.players = playerStatistics;
      return data;
    })
  }

  function predictPlayerStats(player) {
    let events = editableData.matchevents;
    let goals = 0;
    let ownGoals = 0;
    let yellowCards = 0;
    let secondYellowCards = 0;
    let redCards = 0;
    for (let i in events) {
      if (events[i].player1SteamId === player.info.steam_id) {
        player.info.name = events[i].name;
        switch (events[i].event) {
          case 'GOAL':
            goals++;
            break;
          case 'OWN GOAL':
            ownGoals++;
            break;
          case 'YELLOW CARD':
            yellowCards++;
            break;
          case 'SECOND YELLOW':
            secondYellowCards++;
            break;
          case 'RED CARD':
            redCards++;
            break;
          default:
        }
      }
    }
    player.statistics.goals = goals;
    player.statistics.owngoals = ownGoals;
    player.statistics.yellowcards = yellowCards + secondYellowCards;
    player.statistics.redcards = redCards + secondYellowCards;
    if (player.statistics.fouls < (yellowCards + secondYellowCards + redCards)) {
      player.statistics.fouls = yellowCards + secondYellowCards + redCards;
    }
    if (goals > player.statistics.shots) {
      player.statistics.shots = goals;
    }
    if (goals > player.statistics.shotsontarget) {
      player.statistics.shotsontarget = goals;
    }
  }

  function changeVod(vod) {
    setEditableData((prevState) => {
      let data = JSON.parse(JSON.stringify(prevState));
      data.vod = vod;
      return data;
    })
  }

  function changeTeamStats(teams) {
    setEditableData((prevState) => {
      let data = JSON.parse(JSON.stringify(prevState));
      data.teams[0] = teams[0];
      data.teams[1] = teams[1];
      if (data.teams[0].statistics.possession + data.teams[1].statistics.possession !== 100) {
        if (data.teams[0].statistics.possession > data.teams[1].statistics.possession) {
          data.teams[0].statistics.possession = data.teams[0].statistics.possession - 
          ((data.teams[0].statistics.possession + data.teams[1].statistics.possession) - 100);
        } else if (data.teams[1].statistics.possession > data.teams[0].statistics.possession) {
          data.teams[1].statistics.possession = data.teams[1].statistics.possession - 
          ((data.teams[0].statistics.possession + data.teams[1].statistics.possession) - 100);
        }
      }
      return data;
    })
  }

  function changeIndivStats(player, side, index, oldsteamid) {
    setEditableData((prevState) => {
      let data = JSON.parse(JSON.stringify(prevState));
      let s = side === 'home' ? 0 : 1;
      data.teams[s].playerStatistics[index] = player;
      let playerExists = false;
      let steamidlookup;
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
      return data;
    })
    predictTeamStats();
  }

  function removePlayer(player, side, index) {
    setEditableData((prevState) => {
      let data = JSON.parse(JSON.stringify(prevState));
      let s = side === 'home' ? 0 : 1;
      data.teams[s].playerStatistics.splice(index, 1);
      for (let i in data.players) {
        if (data.players[i].info.steam_id === player.info.steam_id) {
          data.players.splice(i, 1);
        }
      }
      data.matchevents = data.matchevents.filter(event => event.player1SteamId !== player.info.steam_id);
      return data;
    })
    predictTeamStats();
  }

  function exportMatch() {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(editableData)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = editableData.filename;
    document.body.appendChild(element);
    element.click();
  }

  function restartEditing() {
    setEditableData(JSON.parse(JSON.stringify(data)));
    setTeamStatsEditing(true);
    setVodEditing(true);
    setTeamStatsEditing(false);
    setVodEditing(false);
  }

  function updateMatch(pw) {
    if (pw === '') {
      alert('Ingrese la contraseña.');
    } else if (editableData.teams[0].statistics.possession + editableData.teams[1].statistics.possession !== 100) {
      alert('Las posesiones están desbalanceadas. Revisá las cuentas.');
    } else {
      setLoading(true);
      axios.post('/api/postupdate', {password: pw, data: editableData}).then((res) => {
        console.log(res.data);
        if (res.data === 'wrong pw') {
          alert('Contraseña incorrecta!');
        } else if (res.data === 'Success!') {
          setSuccess('updating');
        } else {
          alert('Ocurrió un error. Revisá la consola.');
        }
        setLoading(false);
      }).catch(e => console.log(e));
    }
  }

  function deleteMatch(pw) {
    if (pw === '') {
      alert('Ingrese la contraseña.');
    } else {
      setLoading(true);
      axios.post('/api/postdelete', {password: pw, data: editableData}).then((res) => {
        if (res.data === 'wrong pw') {
          alert('Contraseña incorrecta!');
        } else if (res.data === 'Success!') {
          setSuccess('deleting');
        } else {
          alert('Ocurrió un error. Revisá la consola.');
        }
        setLoading(false);
      }).catch(e => console.log(e));
    }
  }

  if (success === 'updating') {
    return (
      <div className="content">
        <div
          className="whitespace"
          style={{
            padding: "0",
            width: "310px",
            textAlign: "center",
            minHeight: "355px",
          }}
        >
          <div className="cartel">
            <FontAwesomeIcon
              icon={faCheckCircle}
              color="--var(header-color)"
              size="5x"
            ></FontAwesomeIcon>
            <div style={{ color: "--var(header-color)" }}>
              Partido modificado correctamente.
            </div>
            <div>
              <button 
                style={{ margin: 0 }} 
                className="boton" 
                onClick={e => {
                  router.push('/partido/' + editableData._id);
                  setSuccess(null);
                }}>
                Ir al partido
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (success === 'deleting') {
    return (
      <div className="content">
        <div
          className="whitespace"
          style={{
            padding: "0",
            width: "310px",
            textAlign: "center",
            minHeight: "355px",
          }}
        >
          <div className="cartel">
            <FontAwesomeIcon
              icon={faCheckCircle}
              color="--var(header-color)"
              size="5x"
            ></FontAwesomeIcon>
            <div style={{ color: "--var(header-color)" }}>
              Partido eliminado correctamente.
            </div>
            <div>
              <button style={{ margin: 0 }} className="boton" onClick={e => router.push('/')}>
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <>
        <Head>
          <title>{data.teams[0].teamname} vs. {data.teams[1].teamname} | IOSoccer Sudamérica</title>
          <meta property="og:type" content="website" />
          <meta property="og:title" content={`${data.teams[0].teamname} vs. ${data.teams[1].teamname}`} />
          <meta property="og:image" content={"/api/matchcard/" + data._id} />
          <meta property="og:site_name" content='IOSoccer Sudamérica' />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${data.teams[0].teamname} vs. ${data.teams[1].teamname} | IOSoccer Sudamérica`} />
          <meta name="twitter:image:src" content={"https://stats.iosoccer-sa.bid/api/matchcard/" + data._id} />
          <meta name="twitter:site" content="@IOSoccerSA" />
        </Head>
        <MatchCard data={editable ? editableData : data} 
          editable={editable} 
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
          setTeamStatsEditing={setTeamStatsEditing}
          setVodEditing={setVodEditing}
          teamStatsEditing={teamStatsEditing}
          vodEditing={vodEditing}
        />
        <div className='colCon'>
          <div className="flexTableDiv"
            style={{
              flexBasis: challonge || !table ? "900px" : "410px",
              flexGrow: 9999,
            }}
          >
            {!teamStatsEditing ? <MatchTeamStats data={editable ? editableData : data} editable={editable} setTeamStatsEditing={setTeamStatsEditing} /> : null}
            {teamStatsEditing ? <MatchTeamStatsEditor data={editableData} changeTeamStats={changeTeamStats} setTeamStatsEditing={setTeamStatsEditing} /> : null}
            {editableChallonge || (challonge && !editable) ? <Challonge id={challonge} /> : null}
          </div>
          {editableTable || (table && !editable) ? 
            <div style={{flexGrow: 1}}>
              <div className='flexTableDiv'>
                <FullPositions 
                  teams={editable ? editableTable : table} 
                  torneo={editable ? editableTablaTorneo : tablaTorneo} 
                  unificada={editableTablaTorneo.startsWith('Superliga') || (!editable && tablaTorneo.startsWith('Superliga'))} 
                />
                {editable ? <p style={{fontSize: '0.8em', textAlign: 'center', color: 'var(--header-color)'}}><i>La tabla se actualizará luego de subir el partido.</i></p> : null}
              </div>
            </div>
          : null}
        </div>
        <MatchIndividualStats 
          players={editable ? editableData.teams[0].playerStatistics : data.teams[0].playerStatistics} 
          teamName={editable ? editableData.teams[0].teamname : data.teams[0].teamname} 
          editable={editable}
          playersAutocomplete={players}
          changeIndivStats={changeIndivStats}
          removePlayer={removePlayer}
          side='home'
        />
        <MatchIndividualStats 
          players={editable ? editableData.teams[1].playerStatistics : data.teams[1].playerStatistics} 
          teamName={editable ? editableData.teams[1].teamname : data.teams[1].teamname} 
          editable={editable}
          playersAutocomplete={players}
          changeIndivStats={changeIndivStats}
          removePlayer={removePlayer}
          side='away'
        />
        {(!editable && data.vod) || (editable && editableData.vod && !vodEditing) ? <Vod vod={editable ? editableData.vod : data.vod} editable={editable} setVodEditing={setVodEditing} changeVod={changeVod} /> : null}
        {(editableData.vod === null && editable) || vodEditing ? <VodEditor vod={editableData.vod} changeVod={changeVod} setVodEditing={setVodEditing} /> : null}
      </>
    )
  }
}