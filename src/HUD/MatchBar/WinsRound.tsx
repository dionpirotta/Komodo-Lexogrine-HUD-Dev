import React from "react";
import { Team } from "csgogsi";
import "./../Styles/winsround.css";

interface Props {
  team: Team;
  show: boolean;
}

export default class WinsRound extends React.Component<Props> {
  render() {
    const { team, show } = this.props;
    if (!team) return null;
    return (
      <div className={`wins_round ${team.orientation} ${show ? "show" : "hide"}`}>
        <div className={`bar ${team.side}`}></div>
        <div className={`text_container ${team.side}`}>WINS THE ROUND</div>
        <div className={`bar ${team.side}`}></div>
      </div>
    );
  }
}
