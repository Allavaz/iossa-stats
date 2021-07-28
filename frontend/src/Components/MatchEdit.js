import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import MatchCardEdit from "./MatchCardEdit";
import FullPositions from "./FullPositions";
import MatchIndividualStatsEdit from "./MatchIndividualStatsEdit";
import Challonge from "./Challonge";
import { api } from "../api";
import FullPositionsUnificada from "./FullPositionsUnificada";
import Torneos from "../Torneos.json"
import VodEditor from "./VodEditor";
import VodEdit from "./VodEdit";
import MatchTeamStatsEdit from "./MatchTeamStatsEdit";
import MatchTeamStatsEditor from "./MatchTeamStatsEditor";

export default class MatchEdit extends Component {
  state = {
    data: [],
    players: [],
    origData: []
  };

  constructor() {
    super();
    this.state = { 
      isLoading: true, 
      isTableLoading: true, 
      challonge: null, 
      table: null, 
      vodEditing: false,
      teamStatsEditing: false,
      status: 'editing'
    };
    this.changeTeam = this.changeTeam.bind(this);
    this.changeTorneo = this.changeTorneo.bind(this);
    this.changeEvents = this.changeEvents.bind(this);
    this.changeScore = this.changeScore.bind(this);
    this.changeVod = this.changeVod.bind(this);
    this.setVodEditing = this.setVodEditing.bind(this);
    this.setTeamStatsEditing = this.setTeamStatsEditing.bind(this);
    this.changeTeamStats = this.changeTeamStats.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.changeIndivStats = this.changeIndivStats.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
    this.exportMatch = this.exportMatch.bind(this);
    this.restartEditing = this.restartEditing.bind(this);
    this.updateMatch = this.updateMatch.bind(this);
    this.deleteMatch = this.deleteMatch.bind(this);
  }

  componentDidMount() {
    axios.get(api + "match/" + this.props.match.params.id).then((res) => {
      this.setState({ data: res.data, origData: JSON.parse(JSON.stringify(res.data)) });
      axios.get(api + "players/all").then((res) => {
        this.setState({ players: res.data })
        for (let i in Torneos) {
          for (let j in Torneos[i].torneos) {
            let t = Torneos[i].torneos[j]
            if (t.torneo === this.state.data.torneo) {
              if (t.challonge) {
                this.setState({
                  isCopa: true,
                  challonge: t.challonge
                })
              } else if (t.tabla) {
                this.setState({
                  isCopa: false,
                  table: t.tabla
                })
              }
            }
          }
        }
      })
      this.setState({
        isLoading: false
      })
      document.title =
        this.state.data.teams[0].teamname +
        " vs " +
        this.state.data.teams[1].teamname +
        " | IOSoccer Sudamérica";
    });
  }

  changeTeam(value, side) {
    let data = this.state.data;
    let s = side === 'home' ? 0 : 1;
    data.teams[s].teamname = value;
    for (let i in data.teams[s].playerStatistics) {
      data.teams[s].playerStatistics[i].info.team = value;
      for (let j in data.players) {
        if (data.teams[s].playerStatistics[i].info.steam_id === data.players[j].info.steam_id) {
          data.players[j].info.team = value;
        }
      }
    }
    this.setState({data: data});
  }

  changeTorneo(value) {
    let data = this.state.data;
    data.torneo = value;
    this.setState({data: data});
    this.setState({challonge: null, table: null});
    for (let i in Torneos) {
      for (let j in Torneos[i].torneos) {
        let t = Torneos[i].torneos[j]
        if (t.torneo === this.state.data.torneo) {
          if (t.challonge) {
            this.setState({
              isCopa: true,
              challonge: t.challonge
            })
          } else if (t.tabla) {
            this.setState({
              isCopa: false,
              table: t.tabla
            })
          }
        }
      }
    }
  }

  changeEvents(matchEvents) {
    let data = this.state.data;
    data.matchevents = matchEvents;
    this.setState({data: data});
    this.predictTeamStats();
    this.predictIndivStats();
  }

  predictTeamStats() {
    let events = this.state.data.matchevents;
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
    let data = this.state.data;
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
    this.setState({data: data});
  }

  predictIndivStats() {
    let data = this.state.data;
    let events = this.state.data.matchevents;
    let steamids = [];
    let homePlayerStatistics = this.state.data.teams[0].playerStatistics;
    let awayPlayerStatistics = this.state.data.teams[1].playerStatistics;
    let playerStatistics = this.state.data.players;
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
          this.predictPlayerStats(homePlayerStatistics[j]);
        }
      }
      for (let j in awayPlayerStatistics) {
        if (steamids[i].steamid === awayPlayerStatistics[j].info.steam_id) {
          found = true;
          this.predictPlayerStats(awayPlayerStatistics[j]);
        }
      }
      for (let j in playerStatistics) {
        if (steamids[i].steamid === playerStatistics[j].info.steam_id) {
          found = true;
          this.predictPlayerStats(playerStatistics[j]);
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
          p.team = data.teams[0].teamname
          this.predictPlayerStats(p);
          homePlayerStatistics.push(p);
        } else if (steamids[i].side === 'away') {
          p.team = data.teams[1].teamname
          this.predictPlayerStats(p);
          awayPlayerStatistics.push(p);
        }
        playerStatistics.push(p);
      }
    }
    data.teams[0].playerStatistics = homePlayerStatistics;
    data.teams[1].playerStatistics = awayPlayerStatistics;
    data.players = playerStatistics;
    this.setState({data: data});
  }

  changeTeamStats(teams) {
    let data = this.state.data;
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
    this.setState({data: data});
  }

  predictPlayerStats(player) {
    let events = this.state.data.matchevents;
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

  changeScore(home, away) {
    let data = this.state.data;
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
  }
  
  setVodEditing(b) {
    this.setState({vodEditing: b});
  }

  changeVod(vod) {
    let data = this.state.data
    data.vod = vod;
    this.setState({data: data, vodEditing: false});
  }

  setTeamStatsEditing(b) {
    this.setState({teamStatsEditing: b});
  }

  changeDate(date) {
    let data = this.state.data;
    data.fecha = date;
    this.setState({data: data});
  }

  changeIndivStats(player, side, index, oldsteamid) {
    let data = this.state.data;
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
    this.predictTeamStats();
    this.setState({data: data});
  }

  removePlayer(player, side, index) {
    let data = this.state.data;
    let s = side === 'home' ? 0 : 1;
    data.teams[s].playerStatistics.splice(index, 1);
    for (let i in data.players) {
      if (data.players[i].info.steam_id === player.info.steam_id) {
        data.players.splice(i, 1);
      }
    }
    data.matchevents = data.matchevents.filter(event => event.player1SteamId !== player.info.steam_id);
    this.predictTeamStats();
    this.setState({data: data});
  }

  exportMatch() {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(this.state.data)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = this.state.data.filename;
    document.body.appendChild(element);
    element.click();
  }

  restartEditing() {
    this.setState({data: JSON.parse(JSON.stringify(this.state.origData))});
    this.setState({teamStatsEditing: true, vodEditing: true});
    this.setState({teamStatsEditing: false, vodEditing: false});
  }

  updateMatch(pw) {
    if (pw === '') {
      alert('Ingrese la contraseña.');
    } else if (this.state.data.teams[0].statistics.possession + this.state.data.teams[1].statistics.possession !== 100) {
      alert('Las posesiones están desbalanceadas. Revisá las cuentas.');
    } else {
      this.setState({isLoading: true});
      axios.post(api + 'postupdate', {password: pw, data: this.state.data}).then((res) => {
        if (res.data === 'wrong pw') {
          alert('Contraseña incorrecta!');
        } else if (res.data === 'Success!') {
          this.setState({status: 'successUpdate'});
        } else {
          alert('Ocurrió un error. Revisá la consola.');
        }
        this.setState({isLoading: false});
      }).catch(e => console.log(e));
    }
  }

  deleteMatch(pw) {
    if (pw === '') {
      alert('Ingrese la contraseña.');
    } else {
      this.setState({isLoading: true});
      axios.post(api + 'postupdate', {password: pw, data: this.state.data}).then((res) => {
        if (res.data === 'wrong pw') {
          alert('Contraseña incorrecta!');
        } else if (res.data === 'Success!') {
          this.setState({status: 'successDelete'});
        } else {
          alert('Ocurrió un error. Revisá la consola.');
        }
        this.setState({isLoading: false});
      }).catch(e => console.log(e));
    }
  }

  render() {
    if (this.state.status === 'editing') {
      return this.state.isLoading ? (
        <div className="content" id="loader">
          <center>
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              size="5x"
              style={{ color: "#ff9800" }}
            ></FontAwesomeIcon>
          </center>
        </div>
      ) : (
        <div className="matchContainer">
          <MatchCardEdit data={this.state.data} 
            players={this.state.players} 
            changeTeam={this.changeTeam} 
            changeTorneo={this.changeTorneo}
            changeEvents={this.changeEvents}
            changeScore={this.changeScore}
            changeDate={this.changeDate}
            exportMatch={this.exportMatch}
            teamStatsEditing={this.state.teamStatsEditing}
            vodEditing={this.state.vodEditing}
            setTeamStatsEditing={this.setTeamStatsEditing}
            setVodEditing={this.setVodEditing}
            restartEditing={this.restartEditing}
            updateMatch={this.updateMatch}
            deleteMatch={this.deleteMatch}
          />
          <div>
            <div className="colCon">
              <div className="flexTableDiv"
                style={{
                  flexBasis: this.state.isCopa ? "900px" : "410px",
                  flexGrow: 9999,
                }}
              >
                {this.state.teamStatsEditing ? <MatchTeamStatsEditor data={this.state.data} setEditing={this.setTeamStatsEditing} changeTeamStats={this.changeTeamStats}></MatchTeamStatsEditor> : <MatchTeamStatsEdit data={this.state.data} setEditing={this.setTeamStatsEditing}></MatchTeamStatsEdit>}
                {this.state.isCopa && this.state.challonge != null ? (
                  <Challonge id={this.state.challonge}></Challonge>
                ) : null}
              </div>
              {this.state.isCopa || this.state.table === null ? null : (
                <div style={{ flexGrow: 1 }}>
                  <div
                    className="content"
                    id="loader"
                    style={{
                      display: this.state.isTableLoading ? "block" : "none",
                    }}
                  >
                    <center>
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        size="5x"
                        style={{ color: "#ff9800", width: "100%" }}
                      ></FontAwesomeIcon>
                    </center>
                  </div>
                  <div className="flexTableDiv"
                    style={{
                      display: this.state.isTableLoading ? "none" : "block",
                      flexGrow: 1,
                    }}
                  >
                    {
                      this.state.table.startsWith("sd") ? 
                      <FullPositionsUnificada
                        table={this.state.table}
                        torneo={this.state.data.torneo}
                        callback={() => {
                          this.setState({ isTableLoading: false });
                        }}
                      ></FullPositionsUnificada> :
                      <FullPositions
                        table={this.state.table}
                        torneo={this.state.data.torneo}
                        callback={() => {
                          this.setState({ isTableLoading: false });
                        }}
                      ></FullPositions>
                    }
                    <p style={{fontSize: '0.8em', textAlign: 'center', color: 'var(--header-color)'}}><i>La tabla se actualizará luego de subir el partido.</i></p>
                  </div>
                </div>
              )}
            </div>
            <MatchIndividualStatsEdit
              data={this.state.data.teams[0]}
              players={this.state.players}
              side='home'
              changeIndivStats={this.changeIndivStats}
              removePlayer={this.removePlayer}
            />
            <MatchIndividualStatsEdit
              data={this.state.data.teams[1]}
              players={this.state.players}
              side='away'
              changeIndivStats={this.changeIndivStats}
              removePlayer={this.removePlayer}
            />
          </div>
          {this.state.data.vod === null || this.state.vodEditing ? <VodEditor changeVod={this.changeVod} setVodEditing={this.setVodEditing} vod={this.state.data.vod}></VodEditor> : (
            <VodEdit vod={this.state.data.vod} setVodEditing={this.setVodEditing}></VodEdit>
          )}
        </div>
      );
    } else if (this.state.status === 'successUpdate') {
      return(
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
                <Link to={"/partido/" + this.state.data._id}>
                  <button style={{ margin: 0 }} className="boton">
                    Ir al partido
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (this.state.status === 'successDelete') {
      return(
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
                <Link to="/">
                  <button style={{ margin: 0 }} className="boton">
                    Volver al inicio
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
