import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import MatchCard from "./MatchCard";
import MatchTeamStats from "./MatchTeamStats";
import FullPositions from "./FullPositions";
import MatchIndividualStats from "./MatchIndividualStats";
import Vod from "./Vod";
import Challonge from "./Challonge";
import { api } from "../api";
import FullPositionsUnificada from "./FullPositionsUnificada";
import Torneos from "../Torneos.json"

export default class Match extends Component {
  state = {
    data: [],
  };

  constructor() {
    super();
    this.state = { isLoading: true, isTableLoading: true, challonge: null, tabla: null };
  }

  componentDidMount() {
    axios.get(api + "match/" + this.props.match.params.id).then((res) => {
      this.setState({ data: res.data });
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
              if (t.tablaLabel) {
                this.setState({tablaLabel: t.tablaLabel})
              }
            }
          }
        }
      }
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
        <MatchCard data={this.state.data}></MatchCard>
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
            {this.state.isCopa || this.state.table === undefined ? null : (
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
                      torneo={this.state.tablaLabel || this.state.data.torneo}
                      callback={() => {
                        this.setState({ isTableLoading: false });
                      }}
                    ></FullPositionsUnificada> :
                    <FullPositions
                      table={this.state.table}
                      torneo={this.state.tablaLabel || this.state.data.torneo}
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
