import React from "react";
import * as I from "csgogsi-socket";
import "./../Styles/series.css";
import { GSI } from "./../../App";
import { Match } from "../../api/interfaces";

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
    showing: boolean;
  };
  right: {
    text: string;
    showing: boolean;
  };
}

export default class SeriesBox extends React.Component<Props, State> {
  state = {
    left: {
      text: "WINS THE ROUND",
      showing: false,
    },
    right: {
      text: "WINS THE ROUND",
      showing: false,
    },
  };
  showText = (text: string, side: "left" | "right", time?: number) => {
    this.setState(
      (state) => {
        state[side].text = text;
        state[side].showing = true;
        return state;
      },
      async () => {
        if (time !== undefined && time < 0) return;
        await wait(time || 4500);
        this.setState((state) => {
          state[side].showing = false;
          return state;
        });
      }
    );
  };
  componentDidMount() {
    GSI.on("roundEnd", (score) => {
      this.showText("WINS THE ROUND", score.winner.orientation);
    });
    GSI.on("defuseStart", (player) => {
      this.showText(`${player.name} IS DEFUSING THE BOMB`, player.team.orientation);
    });
    GSI.on("bombPlantStart", (player) => {
      this.showText(`${player.name} IS PLANTING THE BOMB`, player.team.orientation, 3200);
    });
    GSI.on("bombPlant", (player) => {
      this.showText(`BOMB PLANTED`, player.team.orientation, 3000);
    });
    GSI.on("data", (data) => {
      if (data.phase_countdowns.phase === "timeout_ct") {
        this.showText(`TIMEOUTS REMAINING: ${data.map.team_ct.timeouts_remaining}`, data.map.team_ct.orientation);
      } else if (data.phase_countdowns.phase === "timeout_t") {
        this.showText(`TIMEOUTS REMAINING: ${data.map.team_t.timeouts_remaining}`, data.map.team_t.orientation);
      }
    });
  }
  render() {
    const { match, map } = this.props;
    const amountOfMaps = (match && Math.floor(Number(match.matchType.substr(-1)) / 2) + 1) || 0;
    const bo = (match && Number(match.matchType.substr(-1))) || 0;
    const left = map.team_ct.orientation === "left" ? map.team_ct : map.team_t;
    const right = map.team_ct.orientation === "left" ? map.team_t : map.team_ct;
    const leftAlert = this.state.left;
    const rightAlert = this.state.right;
    return (
      <div id="series">
        <div className="container left">
          <div className={`alert_container left ${leftAlert.showing ? "show" : ""}`}>
            <div className={`alert_bar ${left.side}`}></div>
            <div className={`alert_text_holder ${left.side}`}>
              <div className={`alert_text ${left.side}`}>{leftAlert.text}</div>
            </div>
            <div className={`alert_bar ${left.side}`}></div>
          </div>
          <div className={`series_wins left ${leftAlert.showing ? "" : "show"}`}>
            <div className={`wins_bar left ${left.side}`}></div>
            <div className={`wins_box_container`}>
              {new Array(amountOfMaps).fill(0).map((_, i) => (
                <div key={i} className={`wins_box ${match && match.left.wins > i ? "win" : ""} ${left.side}`} />
              ))}
            </div>
            <div className={`wins_bar left ${left.side}`}></div>
          </div>
        </div>
        <div id="series_container">
          <div id="series_text">BEST OF {bo}</div>
        </div>
        <div className="container right">
          <div className={`series_wins right ${rightAlert.showing ? "" : "show"}`}>
            <div className={`wins_bar right ${right.side}`}></div>
            <div className={`wins_box_container`}>
              {new Array(amountOfMaps).fill(0).map((_, i) => (
                <div key={i} className={`wins_box ${match && match.right.wins > i ? "win" : ""} ${right.side}`} />
              ))}
            </div>
            <div className={`wins_bar right ${right.side}`}></div>
          </div>
          <div className={`alert_container right ${rightAlert.showing ? "show" : ""}`}>
            <div className={`alert_bar ${right.side}`}></div>
            <div className={`alert_text_holder ${right.side}`}>
              <div className={`alert_text ${right.side}`}>{rightAlert.text}</div>
            </div>
            <div className={`alert_bar ${right.side}`}></div>
          </div>
        </div>
      </div>
    );
  }
}
