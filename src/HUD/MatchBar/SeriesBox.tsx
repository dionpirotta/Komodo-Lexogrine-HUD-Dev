import React from "react";
import * as I from "csgogsi-socket";
import "./../Styles/series.css";
import { GSI } from "./../../App";
import { Match } from "../../api/interfaces";
import SeriesScore from "./SeriesScore";
import AnnouncementBox from "./AnnouncementBox";
import { parseConfigFileTextToJson } from "typescript";

const wait = async (ms: number) =>
  new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, ms);
  });

interface Props {
  map: I.Map;
  phase: I.PhaseRaw;
  match: Match | null;
}
interface State {
  left: {
    text: string;
    mapWins: boolean;
    alertType: {
      roundWon: boolean;
      bombPlanted: boolean;
      bombPlanting: boolean;
    };
  };
  right: {
    text: string;
    mapWins: boolean;
    alertType: {
      roundWon: boolean;
      bombPlanted: boolean;
      bombPlanting: boolean;
    };
  };
}

export default class SeriesBox extends React.Component<Props, State> {
  state = {
    left: {
      text: "ANNOUNCEMENT TEXT",
      mapWins: true,
      alertType: {
        roundWon: false,
        bombPlanted: false,
        bombPlanting: false,
      },
    },
    right: {
      text: "ANNOUNCEMENT TEXT",
      mapWins: true,
      alertType: {
        roundWon: false,
        bombPlanted: false,
        bombPlanting: false,
      },
    },
  };
  modAlert = (text: string, side: "left" | "right", alert: "roundWon" | "bombPlanted" | "bombPlanting", time?: number) => {
    this.setState(
      (state) => {
        state[side].text = text;
        state[side].mapWins = false;
        state[side].alertType[alert] = true;
        return state;
      },
      async () => {
        if (time !== undefined && time < 0) {
          return;
        } else if (time && time > 0) {
          await wait(time);
          this.setState((state) => {
            state[side].mapWins = true;
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
    GSI.on("bombPlant", (player) => {
      this.modAlert("BOMB PLANTED", player.team.orientation, "bombPlanted");
      this.setState((state) => {
        state[player.team.orientation].alertType["bombPlanting"] = false;
        return state;
      });
    });
    GSI.on("bombPlantStart", (player) => {
      this.modAlert(`${player.name} IS PLANTING THE BOMB`, player.team.orientation, "bombPlanting");
    });
    // GSI.on("defuseStart", (player) => {
    //   this.modAlert(`${player.name} IS DEFUSING THE BOMB`, player.team.orientation);
    // });
    GSI.on("data", (data) => {
      if (this.state[data.map.team_t.orientation].alertType["bombPlanting"] == true) {
        if (data.bomb?.state !== "planting") {
          this.setState((state) => {
            state[data.map.team_t.orientation].alertType["bombPlanting"] = false;
            return state;
          });
        }
      }
      // if (data.phase_countdowns.phase === "timeout_ct") {
      //   this.modAlert(`TIMEOUTS REMAINING: ${data.map.team_ct.timeouts_remaining}`, data.map.team_ct.orientation);
      // } else if (data.phase_countdowns.phase === "timeout_t") {
      //   this.modAlert(`TIMEOUTS REMAINING: ${data.map.team_t.timeouts_remaining}`, data.map.team_t.orientation);
      // }
    });
  }
  render() {
    const { match, map } = this.props;
    const amountOfMaps = Math.floor(Number(match?.matchType.substr(-1)) / 2) + 1 || 0;
    const left_wins = match?.left.wins || 0;
    const right_wins = match?.right.wins || 0;
    const bo = Number(match?.matchType.substr(-1)) || 0;
    const left = map.team_ct.orientation === "left" ? map.team_ct : map.team_t;
    const right = map.team_ct.orientation === "left" ? map.team_t : map.team_ct;
    return (
      <div id="series">
        <AnnouncementBox
          team={left}
          show={this.state.left.alertType.bombPlanted || this.state.left.alertType.bombPlanting}
          fontsize={24}
          fontweight={400}
          text={this.state.left.text}
          bombPlanted={false}
        />
        <AnnouncementBox team={left} show={this.state.left.alertType.roundWon} fontsize={26} fontweight={600} text={this.state.left.text} bombPlanted={false} />
        <SeriesScore team={left} show={this.state.left.mapWins} wonmaps={amountOfMaps} wins={left_wins} />
        <div id="series_container">
          <div id="series_text">BEST OF {bo}</div>
        </div>
        {/* <SeriesScore team={right} show={this.state.right.mapWins} wonmaps={amountOfMaps} wins={right_wins} /> */}
        <SeriesScore team={right} show={false} wonmaps={amountOfMaps} wins={right_wins} />
        <AnnouncementBox team={right} show={this.state.right.alertType.roundWon} fontsize={26} fontweight={600} text={this.state.right.text} bombPlanted={false} />
        {/* <AnnouncementBox team={right} show={this.state.right.alertType.bombPlanted || this.state.right.alertType.bombPlanting} fontsize={24} fontweight={400} text={this.state.right.text} /> */}
        <AnnouncementBox team={right} show={true} fontsize={24} fontweight={400} text={this.state.right.text} bombPlanted={true} />
      </div>
    );
  }
}
