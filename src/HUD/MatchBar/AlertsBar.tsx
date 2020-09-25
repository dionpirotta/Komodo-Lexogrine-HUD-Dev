import React from "react";
import * as I from "csgogsi-socket";
import { Match } from "../../api/interfaces";
import { GSI } from "./../../App";
import SeriesScore from "./SeriesScore";
import WinsRound from "./WinsRound";
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
    };
  };
  right: {
    text: string;
    seriesScore: boolean;
    alertType: {
      roundWon: boolean;
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
      },
    },
    right: {
      text: "",
      seriesScore: true,
      alertType: {
        roundWon: false,
      },
    },
  };

  modAlert = (text: string, side: "left" | "right", alert: "roundWon", time?: number) => {
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
      this.modAlert("WINS THE ROUND", score.winner.orientation, "roundWon", 5000);
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
          <WinsRound team={left} show={this.state.left.alertType.roundWon} />
          <SeriesScore team={left} show={this.state.left.seriesScore} wonmaps={amountOfMaps} wins={left_wins} />
        </div>
        <div className={`series`}>
          <div className={`series_container`}>
            <div className="series_text">BEST OF {bo}</div>
          </div>
        </div>
        <div className={`side_box right`}>
          <SeriesScore team={right} show={this.state.right.seriesScore} wonmaps={amountOfMaps} wins={right_wins} />
          <WinsRound team={right} show={this.state.right.alertType.roundWon} />
        </div>
      </div>
    );
  }
}