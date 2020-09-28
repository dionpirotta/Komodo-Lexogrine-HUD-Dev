import React from "react";
import * as I from "csgogsi-socket";
import { Match } from "../../api/interfaces";
import { GSI } from "./../../App";
import SeriesScore from "./SeriesScore";
import TextAlert from "./TextAlert";
import "./../Styles/alertsbar.css";
import maps from "../Radar/LexoRadar/maps";
import Bombarino from "./Bombarino";

interface Props {
  map: I.Map;
  phase: I.PhaseRaw;
  match: Match | null;
}

interface State {
  left: {
    text: string;
    seriesScore: boolean;
    alertType: {
      roundWon: boolean;
      planting: boolean;
      defusing: boolean;
      planted: boolean;
      teamTimeout: boolean;
    };
  };
  right: {
    text: string;
    seriesScore: boolean;
    alertType: {
      roundWon: boolean;
      planting: boolean;
      defusing: boolean;
      planted: boolean;
      teamTimeout: boolean;
    };
  };
}

const wait = async (ms: number) =>
  new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, ms);
  });

export default class AlertsBar extends React.Component<Props, State> {
  state = {
    left: {
      text: "",
      seriesScore: true,
      alertType: {
        roundWon: false,
        planting: false,
        defusing: false,
        planted: false,
        teamTimeout: false,
      },
    },
    right: {
      text: "",
      seriesScore: true,
      alertType: {
        roundWon: false,
        planting: false,
        defusing: false,
        planted: false,
        teamTimeout: false,
      },
    },
  };

  modAlert = (text: string, side: "left" | "right", alert: "roundWon" | "planting" | "defusing" | "planted" | "teamTimeout", time?: number) => {
    this.setState(
      (state) => {
        state[side].text = text;
        state[side].seriesScore = false;
        state[side].alertType[alert] = true;
        return state;
      },
      async () => {
        if (time !== undefined && time < 0) {
          return;
        } else if (time && time > 0) {
          await wait(time);
          this.setState((state) => {
            state[side].seriesScore = true;
            state[side].alertType[alert] = false;
            return state;
          });
        }
      }
    );
  };

  modAlertOff = (side: "left" | "right", alert: "roundWon" | "planting" | "defusing" | "planted" | "teamTimeout") => {
    this.setState((state) => {
      state[side].alertType[alert] = false;
      state[side].seriesScore = true;
      return state;
    });
  };

  componentDidMount() {
    GSI.on("roundEnd", (score) => {
      console.log("round end called");
      if (this.state[this.props.map.team_t.orientation].alertType.planted) {
        this.state[this.props.map.team_t.orientation].alertType.planted = false;
      }
      this.modAlert("WINS THE ROUND", score.winner.orientation, "roundWon");
    });

    GSI.on("bombPlantStart", (player) => {
      console.log("bomb plant start called");
      if (this.props.phase.phase !== "over") {
        this.modAlert(`${player.name} is planting`, player.team.orientation, "planting");
      }
    });

    GSI.on("bombPlant", (player) => {
      if (this.props.phase.phase !== "over") {
        console.log("bomb planted");
        this.state[player.team.orientation].alertType.planting = false;
        this.modAlert("PLANTED", player.team.orientation, "planted");
      }
    });

    GSI.on("defuseStart", (player) => {
      console.log("defuse started");
      this.modAlert(`${player.name} is defusing${player.state.defusekit ? " with a kit" : ""}`, player.team.orientation, "defusing");
    });

    GSI.on("defuseStop", (player) => {
      console.log("defuse stopped");
      this.modAlertOff(player.team.orientation, "defusing");
    });

    GSI.on("bombDefuse", (player) => {
      console.log("defused");
      this.state[player.team.orientation].alertType.defusing = false;
      // TODO remove this line under; if defused, hide the bomb area and show T series score
      this.modAlertOff(this.props.map.team_t.orientation, "planted");
    });

    GSI.on("bombExplode", () => {
      if (this.props.phase.phase !== "over") {
        console.log("bomb exploded");
        this.modAlertOff(this.props.map.team_ct.orientation, "defusing");
      }
    });

    GSI.on("data", (data) => {
      if (this.state.right.alertType.planting || this.state.left.alertType.planting) {
        // Fake Plant, or Killed while Planting, or Planted etc
        if (data.bomb?.state !== "planting") {
          console.log("planting was stopped");
          this.modAlertOff(data.map.team_t.orientation, "planting");
        }
      }
      if (this.state.left.alertType.roundWon || this.state.right.alertType.roundWon) {
        if (this.props.phase.phase !== "over") {
          if (this.state.left.alertType.roundWon) {
            this.modAlertOff("left", "roundWon");
          }

          if (this.state.right.alertType.roundWon) {
            this.modAlertOff("right", "roundWon");
          }
        }
      }
      if (data.phase_countdowns.phase === "timeout_ct" || data.phase_countdowns.phase === "timeout_t") {
        this.modAlert(`TIMEOUTS REMAINING: ${data.map.team_ct.timeouts_remaining}`, data.map.team_ct.orientation, "teamTimeout");
        this.modAlert(`TIMEOUTS REMAINING: ${data.map.team_t.timeouts_remaining}`, data.map.team_t.orientation, "teamTimeout");
      }
      if (this.state.left.alertType.teamTimeout || this.state.right.alertType.teamTimeout) {
        if (this.props.phase.phase !== "timeout_ct" && this.props.phase.phase !== "timeout_t") {
          this.modAlertOff("left", "teamTimeout");
          this.modAlertOff("right", "teamTimeout");
        }
      }
    });
  }

  render() {
    const { match, map } = this.props;
    const amountOfMaps = Math.floor(Number(match?.matchType.substr(-1)) / 2) + 1 || 0;
    const bo = Number(match?.matchType.substr(-1)) || 0;
    const left_wins = match?.left.wins || 0;
    const right_wins = match?.right.wins || 0;
    const left = map.team_ct.orientation === "left" ? map.team_ct : map.team_t;
    const right = map.team_ct.orientation === "left" ? map.team_t : map.team_ct;
    return (
      <div className="alerts">
        <div className={`side_box left`}>
          <TextAlert team={left} show={this.state.left.alertType.teamTimeout} text={this.state.left.text} />
          <Bombarino team={left} show={this.state.left.alertType.planted} defusing={this.state.right.alertType.defusing} />
          {/* <TextAlert team={left} show={this.state.left.alertType.planted} text={this.state.left.text} /> */}
          <TextAlert team={left} show={this.state.left.alertType.defusing} text={this.state.left.text} />
          <TextAlert team={left} show={this.state.left.alertType.planting} text={this.state.left.text} />
          <TextAlert team={left} show={this.state.left.alertType.roundWon} text={this.state.left.text} />
          <SeriesScore team={left} show={this.state.left.seriesScore} wonmaps={amountOfMaps} wins={left_wins} />
        </div>
        <div className={`series`}>
          <div className={`series_container`}>
            <div className="series_text">BEST OF {bo}</div>
          </div>
        </div>
        <div className={`side_box right`}>
          <SeriesScore team={right} show={this.state.right.seriesScore} wonmaps={amountOfMaps} wins={right_wins} />
          <TextAlert team={right} show={this.state.right.alertType.roundWon} text={this.state.right.text} />
          <TextAlert team={right} show={this.state.right.alertType.planting} text={this.state.right.text} />
          <TextAlert team={right} show={this.state.right.alertType.defusing} text={this.state.right.text} />
          {/* <TextAlert team={right} show={this.state.right.alertType.planted} text={this.state.right.text} /> */}
          <Bombarino team={right} show={this.state.right.alertType.planted} defusing={this.state.left.alertType.defusing} />
          <TextAlert team={right} show={this.state.right.alertType.teamTimeout} text={this.state.right.text} />
        </div>
      </div>
    );
  }
}
