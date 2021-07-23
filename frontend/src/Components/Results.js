import React, { Component } from "react";
import axios from "axios";
import ReactTable from "react-table";
import "react-table/react-table.css";
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Selector from "./Selector";
import { resultColumns } from "../Columns";
import { api } from "../api";
import Torneos from "../Torneos.json";
import temporadaActual from "../TemporadaActual";

const ReactTableFixedColumns = withFixedColumns(ReactTable);

const tempActual = temporadaActual();

export default class Results extends Component {
  state = {
    data: [],
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      category: "",
      temporada: tempActual,
      search: "",
    };
  }

  componentDidMount() {
    let arg;
    if (this.props.match.params.id) {
      arg = this.props.match.params.id;
    } else {
      arg = tempActual;
    }
    axios.get(api + "matches/" + arg).then((res) => {
      this.changeCategory(arg);
      this.getTemporada(arg);
      this.setState({ data: res.data, isLoading: false, matchesLoading: false });
    });
    document.title = "Resultados | IOSoccer Sudamérica";
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      let loc = this.props.history.location.pathname;
      if (loc.startsWith('/resultados')) {
        let arg;
        if (loc === '/resultados') {
          arg = tempActual;
        } else {
          arg = loc.replace('/resultados/', '');
        }
        this.setState({ matchesLoading: true });
        axios.get(api + "matches/" + arg).then((res) => {
          this.changeCategory(arg);
          this.getTemporada(arg);
          this.setState({ data: res.data, matchesLoading: false });
        });
      }
    }
  }

  changeCategory = (arg) => {
    if (arg === 'all') {
      this.setState({ category: "TOTALES" });
    } else if (arg.startsWith("t")) {
      this.setState({ category: "TEMPORADA " + arg.replace('t', '') });
    } else if (arg === 'selecciones') {
      this.setState({ category: "SELECCIONES" });
    } else {
      for (let i in Torneos) {
        for (let j in Torneos[i].torneos) {
          if (arg === Torneos[i].torneos[j].query) {
            this.setState({ category: Torneos[i].torneos[j].torneo.toUpperCase() });
          }
        }
      }
    }
  }

  selectTorneo = (arg) => {
    this.setState({ matchesLoading: true });
    axios.get(api + "matches/" + arg).then((res) => {
      this.changeCategory(arg);
      this.setState({ data: res.data, matchesLoading: false });
    });
    this.props.history.push(`/resultados/${arg}`)
  };

  selectTemporada = () => {
    let selector = document.getElementById("selector");
    let selected = selector.options[selector.selectedIndex].value
    this.setState({
      temporada: selected
    });
    this.selectTorneo(selected);
  };

  getTemporada = (arg) => {
    if (arg.startsWith('t') || arg === 'all' || arg === 'selecciones') {
      this.setState({ temporada: arg });
    } else {
      for (let i in Torneos) {
        for (let j in Torneos[i].torneos) {
          if (arg === Torneos[i].torneos[j].query) {
            this.setState({ temporada: Torneos[i].temporada });
          }
        }
      }
    }
    if (document.getElementById("selector")) {
      let selector = document.getElementById("selector");
      for (let i in selector.options) {
        if (selector.options[i].value === arg) {
          selector.selectedIndex = i;
        }
      }
    }
  }

  render() {
    const TheadComponent = (props) => null;

    let data = this.state.data;

    if (this.state.search) {
      data = data.filter((row) => {
        return (
          row.teams[0].teamname
            .toLowerCase()
            .includes(this.state.search.toLowerCase()) ||
          row.teams[1].teamname
            .toLowerCase()
            .includes(this.state.search.toLowerCase()) ||
          row.torneo.toLowerCase().includes(this.state.search.toLowerCase())
        );
      });
    }

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
      <div className="content">
        <Selector
          prop1={this.selectTorneo}
          prop2={this.selectTemporada}
          prop3={this.state.temporada}
        ></Selector>
        <div style={{ opacity: this.state.matchesLoading ? 0.5 : 1 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <h3 style={{ display: "inline", marginRight: "10px" }}>
              RESULTADOS {this.state.category}
            </h3>
            <input
              value={this.state.search}
              onChange={(e) => this.setState({ search: e.target.value })}
              placeholder="Buscar equipo/torneo…"
              style={{
                border: "1px solid var(--button-border)",
                fontSize: "11pt",
                padding: "5px",
                height: "20px",
                backgroundColor: "var(--card-background)",
                color: "var(--normal-text-color)",
                boxShadow: "var(--shadow)"
              }}
            />
          </div>
          <ReactTableFixedColumns
            className="-striped -highlight"
            data={data}
            TheadComponent={TheadComponent}
            columns={resultColumns}
            resizable={false}
            previousText={"Anterior"}
            nextText={"Siguiente"}
            noDataText={"No hay partidos"}
            pageText={"Página"}
            ofText={"de"}
            rowsText={"filas"}
            showPageSizeOptions={false}
            defaultPageSize={20}
            /* getTrProps={(state, rowInfo, column, instance) => ({
              onClick: (e) => {
                //this.props.history.push("/partido/" + rowInfo.original._id);
              },
              style: {
                cursor: "pointer",
              },
            })} */
          />
        </div>
      </div>
    );
  }
}
