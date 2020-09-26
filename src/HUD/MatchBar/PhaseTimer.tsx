import React from "react";
import * as I from "csgogsi-socket";
import "./../Styles/phasetimer.css";
// import { Timer } from "./MatchBar";
import { GSI } from "../../App";
import { Hourglass, BombExplosionT, C4, C4T, Defuse, DefuseCT, Pause, PauseCT, PauseT, SkullT, SkullCT, TimerCT } from "./../../assets/Icons";
const timeoutTime = 30;

interface Props {
  phase: I.PhaseRaw;
  map: I.Map;
  bomb: I.Bomb | null;
  leftPlayers: I.Player[];
  rightPlayers: I.Player[];
}

interface State {
  showImage: boolean;
  whichImage: string;
  bgColor: string;
  bgHeight: number;
  textColor: string;
}

function stringToClock(time: string | number, pad = true) {
  if (typeof time === "string") {
    time = parseFloat(time);
  }
  const countdown = Math.abs(Math.ceil(time));
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown - minutes * 60;
  if (pad && seconds < 10) {
    return `${minutes}:0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

export default class PhaseTimer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showImage: false,
      whichImage: "",
      bgColor: "",
      bgHeight: 0,
      textColor: "--white-full",
    };
  }

  setWhichImageState(show: boolean, to: string) {
    if (this.state.whichImage != to) {
      this.setState({ whichImage: to });
    }
    if (this.state.showImage != show) {
      this.setState({ showImage: show });
    }
  }

  resetMiddleImage() {
    if (this.props.phase?.phase === "freezetime" || this.props.phase?.phase === "live") {
      if (this.props.bomb?.state !== "defusing" && this.props.bomb?.state !== "planted" && this.props.bomb?.state !== "defused" && this.props.bomb?.state !== "exploded") {
        this.setWhichImageState(false, "");
        this.setState({ textColor: "--white-full" });
      }
    }
  }

  componentDidMount() {
    GSI.on("bombPlant", () => {
      if (this.props.phase.phase !== "over") {
        this.setWhichImageState(true, C4T);
        //   this.setState({ whichImage: C4, bgColor: "--color-bomb" });
      }
    });

    GSI.on("roundEnd", () => {
      let leftPlayerCount = this.props.leftPlayers.filter((player) => player.state.health > 0).length;
      let leftTeamSide = this.props.map.team_ct.orientation === "left" ? this.props.map.team_ct.side : this.props.map.team_t.side;
      let rightPlayerCount = this.props.rightPlayers.filter((player) => player.state.health > 0).length;
      let rightTeamSide = this.props.map.team_ct.orientation === "right" ? this.props.map.team_ct.side : this.props.map.team_t.side;

      if (this.props.bomb?.state === "defused") {
        this.setWhichImageState(true, DefuseCT);
        // this.setState({ whichImage: Defuse, bgColor: "--color-defuse" });
      } else if (this.props.bomb?.state === "exploded") {
        this.setWhichImageState(true, BombExplosionT);
      } else if (this.props.bomb?.state === "planted") {
        this.setWhichImageState(true, SkullT);
      } else {
        if (leftTeamSide === "T") {
          if (leftPlayerCount > 0 && rightPlayerCount === 0) {
            // T elim CT
            this.setWhichImageState(true, SkullT);
          } else if (rightPlayerCount > 0 && leftPlayerCount === 0) {
            // CT elim T
            this.setWhichImageState(true, SkullCT);
          } else if (rightPlayerCount > 0 && leftPlayerCount > 0) {
            // CT timed T
            this.setWhichImageState(true, TimerCT);
          }
        } else if (rightTeamSide === "T") {
          if (rightPlayerCount > 0 && leftPlayerCount === 0) {
            // T elim CT
            this.setWhichImageState(true, SkullT);
          } else if (leftPlayerCount > 0 && rightPlayerCount === 0) {
            // CT elim T
            this.setWhichImageState(true, SkullCT);
          } else if (leftPlayerCount > 0 && rightPlayerCount > 0) {
            // CT timed T
            this.setWhichImageState(true, TimerCT);
          }
        }
      }
    });

    GSI.on("data", () => {
      this.resetMiddleImage();
      if (this.props.phase.phase === "paused") {
        this.setWhichImageState(true, Pause);
      } else if (this.props.phase.phase === "timeout_t") {
        this.setWhichImageState(true, PauseT);
        this.setState({ bgColor: "--white-dull" });
        this.setState({ bgHeight: (100 / timeoutTime) * +this.props.phase.phase_ends_in });
      } else if (this.props.phase.phase === "timeout_ct") {
        this.setWhichImageState(true, PauseCT);
        this.setState({ bgColor: "--white-dull" });
        this.setState({ bgHeight: (100 / timeoutTime) * +this.props.phase.phase_ends_in });
      } else if (this.props.phase.phase === "warmup") {
        this.setWhichImageState(true, Hourglass);
      } else if (this.props.phase.phase === "live") {
        if (this.props.phase.phase_ends_in < "10") {
          this.setState({ textColor: "--color-bomb" });
        }
      }
    });
  }

  render() {
    const time = stringToClock(this.props.phase.phase_ends_in);
    const phase = this.props.phase.phase;
    const bomb = this.props.bomb;
    const isBombState = bomb?.state === "defusing" || bomb?.state === "planted" || bomb?.state === "defused" || bomb?.state === "exploded";
    var style = getComputedStyle(document.body);

    // console.log(phase);
    // console.log(bomb);
    // console.log(this.props.map);
    return (
      <div className={`phase_timer`}>
        <div className={`text_display ${this.state.showImage ? "hide" : ""}`}>
          {/* <div className={`text_display`}> */}
          <div className={`timer_display`} style={{ color: style.getPropertyValue(this.state.textColor) }}>
            {time}
          </div>
          <div className={`round_display`}>Round {this.props.map.round + 1}</div>
        </div>
        <div className={`image_display ${this.state.showImage ? "" : "hide"}`}>
          <div className={`bg`} style={{ backgroundColor: style.getPropertyValue(this.state.bgColor), height: this.state.bgHeight + "%" }}></div>
          <img src={this.state.whichImage} />
        </div>
      </div>
    );
  }
}
