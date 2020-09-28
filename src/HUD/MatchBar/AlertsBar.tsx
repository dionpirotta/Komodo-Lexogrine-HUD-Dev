import React from "react";
import * as I from "csgogsi-socket";
import { Match } from "../../api/interfaces";
import { GSI } from "./../../App";
import SeriesScore from "./SeriesScore";
import TextAlert from "./TextAlert";
import "./../Styles/alertsbar.css";

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
    };
  };
  right: {
    text: string;
    seriesScore: boolean;
    alertType: {
      roundWon: boolean;
      planting: boolean;
      defusing: boolean;
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
      },
    },
    right: {
      text: "",
      seriesScore: true,
      alertType: {
        roundWon: false,
        planting: false,
        defusing: false,
      },
    },
  };

  modAlert = (text: string, side: "left" | "right", alert: "roundWon" | "planting" | "defusing", time?: number) => {
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

  componentDidMount() {
    GSI.on("roundEnd", (score) => {
      console.log("round end called");
      this.modAlert("WINS THE ROUND", score.winner.orientation, "roundWon", 5000);
    });

    GSI.on("bombPlantStart", (player) => {
      console.log("bomb plant start called");
      this.modAlert(`${player.name} is planting`, player.team.orientation, "planting");
    });

    GSI.on("bombPlant", (player) => {
      console.log("bomb planted");
      this.state[player.team.orientation].alertType.planting = false;
      // TODO show the bombPlant bit
    });

    GSI.on("defuseStart", (player) => {
      console.log("defuse started");
      this.modAlert(`${player.name} is defusing${player.state.defusekit ? " with a kit" : ""}`, player.team.orientation, "defusing");
    });

    GSI.on("defuseStop", (player) => {
      console.log("defuse stopped");
      this.state[player.team.orientation].alertType.defusing = false;
      this.state[player.team.orientation].seriesScore = true;
    });

    GSI.on("bombDefuse", (player) => {
      console.log("defused");
      this.state[player.team.orientation].alertType.defusing = false;
      // if defused, hide the bomb area and show T series score
      // this.state[this.props.map.team_t.orientation].seriesScore = true;
    });

    GSI.on("bombExplode", () => {
      console.log("bomb exploded");
      // check if need to also hide defusing stuff like in defuseStop (ie if dies to bomb explosion whilst defusing, will defuseStop be called as well as bombExplode)
    });

    GSI.on("data", (data) => {
      if (this.state.right.alertType.planting || this.state.left.alertType.planting) {
        // Fake Plant, or Killed while Planting, or Planted etc
        if (data.bomb?.state !== "planting") {
          console.log("planting was stopped");
          this.state[data.map.team_t.orientation].alertType.planting = false;
          this.state[data.map.team_t.orientation].seriesScore = true;
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
          {/* Round alert - wins the round/timeouts/match point */}
          {/* bomb plant / defuse / is planting / is defusing */}
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
        </div>
      </div>
    );
  }
}
