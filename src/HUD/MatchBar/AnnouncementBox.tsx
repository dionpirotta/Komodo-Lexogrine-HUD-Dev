import React from "react";
import "./../Styles/announcementbox.css";
import { Team } from "csgogsi";

interface IProps {
  team: Team;
  show: boolean;
  fontsize: number;
  fontweight: number;
  text: string;
  bombPlanted: boolean;
}

export interface IState {
  bomb: {
    height: number;
    width: number;
  };
  defuse: {
    width: number;
  };
  defuseHolder: {
    height: number;
  };
}

export default class AnnouncementBox extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      bomb: {
        height: 50, // 50 or 100
        width: 100,
      },
      defuse: {
        width: 100,
      },
      defuseHolder: {
        height: 50, // 50 or 0
      },
    };
  }
  // componentDidMount() {
  //   const bomb = new BombTimer((time) => {
  //     let height = time > 40 ? 4000 : time * 100;
  //     this.setState({ height: height / 40 });
  //   });
  //   bomb.onReset(this.hide);
  //   GSI.on("data", (data) => {
  //     if (data.bomb && data.bomb.countdown) {
  //       if (data.bomb.state === "planted") {
  //         this.setState({ show: true });
  //         return bomb.go(data.bomb.countdown);
  //       }
  //       if (data.bomb.state !== "defusing") {
  //         this.hide();
  //       }
  //     } else {
  //       this.hide();
  //     }
  //   });
  // }

  render() {
    const { team, show, fontsize, fontweight, text, bombPlanted } = this.props;
    if (!team) return null;
    return (
      <div className={`announcement_box ${show ? "show" : "hide"} ${team.orientation}`}>
        <div className={`bar ${team.side}`}></div>
        <div className={`inside_container`}>
          <div className={`announcement_text ${team.side} ${bombPlanted ? "bomb_active" : ""}`} style={{ fontSize: fontsize + "px", fontWeight: fontweight }}>
            {text}
          </div>
          <div className={`bomb_planted ${bombPlanted ? "bomb_active" : ""}`}>
            <div className={`bomb_bar`} style={{ height: `${this.state.bomb.height}%`, width: `${this.state.bomb.width}%` }}></div>
            <div className={`defuse_holder`} style={{ height: `${this.state.defuseHolder.height}%` }}>
              <div className={`defuse_bar`} style={{ width: `${this.state.defuse.width}%` }}></div>
              <div className={`defuser`}></div>
            </div>
          </div>
        </div>
        <div className={`bar ${team.side}`}></div>
      </div>
    );
  }
}
