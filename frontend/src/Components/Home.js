import React, { Component } from "react";
import Matches from "./Matches";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import MiniPositions from "./MiniPositions";
import MiniPositionsUnificada from "./MiniPositionsUnificada";

const minitables = [
  //{torneo: "d1t7", header: "Liga D1 T7"},
  //{torneo: "d2t7", header: "Liga D2 T7"},
  {torneo: "maradeit7a", header: "Copa Maradei T7 - Grupo A"},
  {torneo: "maradeit7b", header: "Copa Maradei T7 - Grupo B"},
  {torneo: "maradeit7c", header: "Copa Maradei T7 - Grupo C"},
  {torneo: "maradeit7d", header: "Copa Maradei T7 - Grupo D"},
  {torneo: "sd1t7", header: "Superliga D1 T7" },
];

export default class Home extends Component {
  state = {
    loadingItems: minitables.length + 1,
  };

  componentDidMount() {
    document.title = "IOSoccer Sudamérica";
  }

  reduceLoadingItems = () => {
    this.setState({ loadingItems: this.state.loadingItems - 1 });
  };

  render() {
    return (
      <div>
        <div
          className="content"
          id="loader"
          style={{ display: this.state.loadingItems > 0 ? "block" : "none" }}
        >
          <center>
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              size="5x"
              style={{ color: "#ff9800" }}
            ></FontAwesomeIcon>
          </center>
        </div>
        <div
          className="content"
          style={{ display: this.state.loadingItems === 0 ? "block" : "none" }}
        >
          <div className="colCon">
            <Matches callback={this.reduceLoadingItems}></Matches>
            <div className="flexTableDiv" style={{flexGrow: 1 }}>
              {minitables.map((i) => (
                i.torneo === "sd1t7" ?
                <MiniPositionsUnificada
                  torneo={i.torneo}
                  header={i.header}
                  callback={this.reduceLoadingItems}
                ></MiniPositionsUnificada> :
                <MiniPositions
                  torneo={i.torneo}
                  header={i.header}
                  callback={this.reduceLoadingItems}
                ></MiniPositions>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
