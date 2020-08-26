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

export default class Match extends Component {
  state = {
    data: [],
  };

  constructor() {
    super();
    this.state = { isLoading: true, isTableLoading: true, challonge: null };
  }

  componentDidMount() {
    axios.get(api + "match/" + this.props.match.params.id).then((res) => {
      this.setState({ data: res.data });
      switch (this.state.data.torneo) {
        case "Liga Master T0":
          this.setState({ isCopa: false, isLoading: false, table: "lmt0" });
          break;
        case "Division de Honor T0":
          this.setState({ isCopa: false, isLoading: false, table: "ddht0" });
          break;
        case "Copa Maradei T1 - Grupo A":
          this.setState({
            isCopa: false,
            isLoading: false,
            table: "maradeit1a",
          });
          break;
        case "Copa Maradei T1 - Grupo B":
          this.setState({
            isCopa: false,
            isLoading: false,
            table: "maradeit1b",
          });
          break;
        case "Copa Maradei T1 - Grupo C":
          this.setState({
            isCopa: false,
            isLoading: false,
            table: "maradeit1c",
          });
          break;
        case "Copa Maradei T1 - Eliminatorias":
          this.setState({
            isCopa: true,
            challonge: "Copamaradei2018",
            isLoading: false,
          });
          break;
        case "Liga D1 T1":
          this.setState({ isCopa: false, isLoading: false, table: "d1t1" });
          break;
        case "Liga D1 - Temporada 2":
          this.setState({ isCopa: false, isLoading: false, table: "d1t2" });
          break;
        case "Liga D1 - Temporada 2 (Desempate)":
          this.setState({ isCopa: false, isLoading: false, table: "d1t2" });
          break;
        case "Liga D2 - Temporada 1":
          this.setState({ isCopa: false, isLoading: false, table: "d2t1" });
          break;
        case "Liga D1 T3":
          this.setState({ isCopa: false, isLoading: false, table: "d1t3" });
          break;
        case "Liga D2 T3":
          this.setState({ isCopa: false, isLoading: false, table: "d2t3" });
          break;
        case "Copa Master 2019":
          this.setState({
            isCopa: true,
            challonge: "Copamasterr",
            isLoading: false,
          });
          break;
        case "Recopa Master 2019":
          this.setState({ isCopa: true, isLoading: false });
          break;
        case "Copa Master T3":
          this.setState({
            isCopa: true,
            challonge: "CopaMasster2",
            isLoading: false,
          });
          break;
        case "Copa Maradei T3 - Grupo A":
          this.setState({
            isCopa: false,
            isLoading: false,
            table: "maradeit3a",
          });
          break;
        case "Copa Maradei T3 - Grupo B":
          this.setState({
            isCopa: false,
            isLoading: false,
            table: "maradeit3b",
          });
          break;
        case "Copa Maradei T3 - Grupo C":
          this.setState({
            isCopa: false,
            isLoading: false,
            table: "maradeit3c",
          });
          break;
        case "Copa Maradei T3 - Grupo D":
          this.setState({
            isCopa: false,
            isLoading: false,
            table: "maradeit3d",
          });
          break;
        case "Copa Maradei T3 - Eliminatorias":
          this.setState({
            isCopa: true,
            challonge: "Maradei3",
            isLoading: false,
          });
          break;
        case "Copa America T3":
          this.setState({
            isCopa: false,
            isLoading: false,
            table: "americat3",
          });
          break;
        case "Copa del Sur T3":
          this.setState({
            isCopa: true,
            challonge: "copadelsur",
            isLoading: false,
          });
          break;
        case "Liga D1 T4":
          this.setState({ isCopa: false, isLoading: false, table: "d1t4" });
          break;
        case "Liga D1 T4 - (Desempate)":
          this.setState({ isCopa: false, isLoading: false, table: "d1t4" });
          break;
        case "Liga D2 T4":
          this.setState({ isCopa: false, isLoading: false, table: "d2t4" });
          break;
        case "Copa Gubero T4":
          this.setState({
            isCopa: true,
            challonge: "copagubero",
            isLoading: false,
          });
          break;
        case "Liga Master T5":
          this.setState({ isCopa: false, isLoading: false, table: "lmt5" });
          break;
        case "Division de Honor T5":
          this.setState({ isCopa: false, isLoading: false, table: "ddht5" });
          break;
        case "Copa Maradei T5 - Grupo A":
          this.setState({
            isCopa: false,
            isLoading: false,
            table: "maradeit5a",
          });
          break;
        case "Copa Maradei T5 - Grupo B":
          this.setState({
            isCopa: false,
            isLoading: false,
            table: "maradeit5b",
          });
          break;
        case "Copa Maradei T5 - Grupo C":
          this.setState({
            isCopa: false,
            isLoading: false,
            table: "maradeit5c",
          });
          break;
        case "Copa Maradei T5 - Eliminatorias":
          this.setState({
            isCopa: true,
            challonge: "Maradeit5",
            isLoading: false,
          });
          break;
        case "Copa Master T5":
          this.setState({
            isCopa: true,
            challonge: "copamastert5",
            isLoading: false,
          });
          break;
        case "Superliga D1 T6":
          this.setState({ isCopa: false, isLoading: false, table: "sd1t6" });
          break;
        case "Liga D1 T6":
          this.setState({ isCopa: false, isLoading: false, table: "d1t6" });
          break;
        case "Liga D2 T6":
          this.setState({ isCopa: false, isLoading: false, table: "d2t6" });
          break;
        case "Copa Maradei T6 - Grupo A":
          this.setState({
            isCopa: false,
            isLoading: false,
            table: "maradeit6a",
          });
          break;
        case "Copa Maradei T6 - Grupo B":
          this.setState({
            isCopa: false,
            isLoading: false,
            table: "maradeit6b",
          });
          break;
        case "Copa Maradei T6 - Grupo C":
          this.setState({
            isCopa: false,
            isLoading: false,
            table: "maradeit6c",
          });
          break;
        default:
          this.setState({ isCopa: false, isLoading: false });
          break;
      }
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
          <div className="colCon" style={{ margin: "-10px" }}>
            <div
              style={{
                flexBasis: this.state.isCopa ? "900px" : "410px",
                margin: "10px",
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
                <div
                  style={{
                    display: this.state.isTableLoading ? "none" : "block",
                    margin: "10px",
                    flexGrow: 1,
                  }}
                >
                  {
                    this.state.table === "sd1t6" ? 
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
