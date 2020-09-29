import React from "react";
import { Team } from "csgogsi";
import "./../Styles/bombarino.css";
import BombTimer from "./../Timers/Countdown";
import { GSI } from "./../../App";

interface Props {
  team: Team;
  show: boolean;
  defusing: boolean;
}

interface State {
  bombBarHeight: number;
  bombBarWidth: number;
  defuseBarHeight: number;
  defuseBarWidth: number;
  bombTime: number;
  textColor: string;
  textThickness: number;
}

export default class Bombarino extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      bombBarHeight: 50,
      bombBarWidth: 100,
      defuseBarHeight: 50,
      defuseBarWidth: 100,
      bombTime: 40.0,
      textColor: "--white-full",
      textThickness: 500,
    };
  }

  hideDefuse = () => {
    this.setState({ bombBarHeight: 100, defuseBarHeight: 0 });
  };

  showDefuse = () => {
    this.setState({ bombBarHeight: 50, defuseBarHeight: 50 });
  };

  resetBomb = () => {
    this.setState({ bombBarHeight: 100, defuseBarHeight: 0, bombBarWidth: 0, defuseBarWidth: 100, textColor: "--white-full", textThickness: 500 });
  };

  componentDidMount() {
    const bomb = new BombTimer((time) => {
      let width = time > 40 ? 4000 : time * 100;
      this.setState({ bombBarWidth: width / 40, bombTime: Math.round(time * 1e1) / 1e1 });
      if (time <= 5) {
        this.setState({ textColor: "--color-bomb", textThickness: 600 });
      }
    });

    bomb.onReset(this.resetBomb);

    GSI.on("data", (data) => {
      if (data.bomb?.countdown) {
        if (data.bomb.state === "planted") {
          return bomb.go(data.bomb.countdown);
        }
        if (data.bomb.state === "defusing") {
          this.setState({ defuseBarWidth: +data.bomb?.countdown * 10 });
        }
      } else {
        this.resetBomb();
      }
    });

    GSI.on("defuseStart", () => {
      this.showDefuse();
    });

    GSI.on("defuseStop", () => {
      this.hideDefuse();
    });
  }

  render() {
    const { team, show } = this.props;
    var style = getComputedStyle(document.body);
    if (!team) return null;
    return (
      <div className={`bomb_box ${show ? "show" : "hide"} ${team.orientation}`}>
        <div className={`bar ${team.side}`}></div>
        <div className={`bomb_inside`}>
          <div className={`bomb_bar`} style={{ height: `${this.state.bombBarHeight}%`, width: `${this.state.bombBarWidth}%` }}></div>
          <div className={`defuse_holder`} style={{ height: `${this.state.defuseBarHeight}%` }}>
            <div className={`defuse_bar`} style={{ width: `${this.state.defuseBarWidth}%` }}></div>
          </div>
        </div>
        <div className={`bar ${team.side}`}></div>
        <div className={`bomb_time`}>
          <div className={`bomb_text`} style={{ color: style.getPropertyValue(this.state.textColor), fontWeight: this.state.textThickness }}>
            {this.state.bombTime}
          </div>
        </div>
        <div className={`bar ${team.side}`}></div>
      </div>
    );
  }
}
