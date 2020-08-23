import React, { Component } from "react";
import axios from "axios";
import { api } from "../api";
import Teams from "../Teams";

export default class MiniPositions extends Component {
  state = {
    data: [],
  };

  componentDidMount() {
    axios.get(api + "positions/" + this.props.torneo).then((res) => {
      this.setState({ data: res.data });
      this.props.callback();
    });
  }

  render() {
    return this.state.data === [] ? null : (
      <div>
        <h3>{this.props.header.toUpperCase()}</h3>
        <div className="divDataTable">
          <table className="dataTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Equipo</th>
                <th>PJ</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((item, index) => (
                <>
                  {index < 5 ? (
                    <tr key={item._id}>
                      <>
                        <td width="15px">{index + 1}</td>

                        <td>
                          <div className="teamlogo">
                            <img
                              style={{ marginLeft: "0px" }}
                              height="16px"
                              src={`/clubs/${Teams[
                                item._id
                              ].toLowerCase()}.png`}
                              alt={item._id}
                            ></img>{" "}
                            <div id="fullteamname">{item._id}</div>
                          </div>
                        </td>
                        <td width="15px">{item.PJ}</td>
                        <td width="15px">{item.Pts}</td>
                      </>
                    </tr>
                  ) : (
                    <tr key={item._id}>
                      <>
                        <td
                          className="D2"
                          width="15px"
                          style={{
                            backgroundColor: index % 2 === 0 ? "#7adbff" : null,
                          }}
                        >
                          {index + 1}
                        </td>

                        <td
                          className="D2"
                          style={{
                            backgroundColor: index % 2 === 0 ? "#7adbff" : null,
                          }}
                        >
                          <div className="teamlogo">
                            <img
                              style={{ marginLeft: "0px" }}
                              height="16px"
                              src={`/clubs/${Teams[
                                item._id
                              ].toLowerCase()}.png`}
                              alt={item._id}
                            ></img>{" "}
                            <div id="fullteamname">{item._id}</div>
                          </div>
                        </td>
                        <td
                          className="D2"
                          width="15px"
                          style={{
                            backgroundColor: index % 2 === 0 ? "#7adbff" : null,
                          }}
                        >
                          {item.PJ}
                        </td>
                        <td
                          className="D2"
                          width="15px"
                          style={{
                            backgroundColor: index % 2 === 0 ? "#7adbff" : null,
                          }}
                        >
                          {item.Pts}
                        </td>
                      </>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <p style={{ backgroundColor: "#fa9d41", textAlign: "center" }}>
            1° al 5° puestos clasifican a la D1
          </p>
          <p style={{ backgroundColor: "#1cc2ff", textAlign: "center" }}>
            6° al 10° puestos clasifican a la D2
          </p>
        </div>
      </div>
    );
  }
}
