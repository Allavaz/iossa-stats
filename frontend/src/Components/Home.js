import React, { Component } from "react";
import Matches from "./Matches";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import MiniPositions from "./MiniPositions";
import MiniPositionsUnificada from "./MiniPositionsUnificada";

const minitables = [
  {torneo: "d1t6", header: "Liga D1 T6"},
  {torneo: "d2t6", header: "Liga D2 T6"},
  {torneo: "maradeit6a", header: "Copa Maradei T6 - Grupo A"},
  {torneo: "maradeit6b", header: "Copa Maradei T6 - Grupo B"},
  {torneo: "maradeit6c", header: "Copa Maradei T6 - Grupo C"},
  { torneo: "sd1t6", header: "Superliga D1 T6" },
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
                i.torneo === "sd1t6" ?
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
