import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import MatchCardEdit from "./MatchCardEdit";
import MatchTeamStats from "./MatchTeamStats";
import FullPositions from "./FullPositions";
import MatchIndividualStats from "./MatchIndividualStats";
import Vod from "./Vod";
import Challonge from "./Challonge";
import { api } from "../api";
import FullPositionsUnificada from "./FullPositionsUnificada";
import Torneos from "../Torneos.json"

export default class MatchEdit extends Component {
  state = {
    data: [],
    players: []
  };

  constructor() {
    super();
    this.state = { isLoading: true, isTableLoading: true, challonge: null, table: null };
    this.changeTeam = this.changeTeam.bind(this);
    this.changeTorneo = this.changeTorneo.bind(this);
    this.changeEvents = this.changeEvents.bind(this);
    this.changeScore = this.changeScore.bind(this);
  }

  componentDidMount() {
    axios.get(api + "match/" + this.props.match.params.id).then((res) => {
      this.setState({ data: res.data });
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
    let s = side === 'home' ? 0 : 1
    data.teams[s].teamname = value
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
    this.updateStats();
  }

  updateStats() {
    let events = this.state.data.matchevents;
    let homeScore = 0;
    let awayScore = 0;
    for (let i in events) {
      if (events[i].event === 'GOAL') {
        if (events[i].team === 'home') {
          homeScore++;
        } else if (events[i].team === 'away') {
          awayScore++;
        }
      }
    }
    let data = this.state.data;
    data.teams[0].score = homeScore;
    data.teams[0].scorereceived = awayScore;
    data.teams[1].score = awayScore;
    data.teams[1].scorereceived = homeScore;
    this.setState({data: data});
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

  render() {
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
        />
        <div>
          <div className="colCon">
            <div className="flexTableDiv"
              style={{
                flexBasis: this.state.isCopa ? "900px" : "410px",
                flexGrow: 9999,
              }}
            >
              <MatchTeamStats data={this.state.data}></MatchTeamStats>
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
                </div>
              </div>
            )}
          </div>
          <MatchIndividualStats
            data={this.state.data.teams[0]}
          ></MatchIndividualStats>
          <MatchIndividualStats
            data={this.state.data.teams[1]}
          ></MatchIndividualStats>
        </div>
        {this.state.data.vod === null ? null : (
          <Vod vod={this.state.data.vod}></Vod>
        )}
      </div>
    );
  }
}
