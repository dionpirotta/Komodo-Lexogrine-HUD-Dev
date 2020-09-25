import React from "react";
import "./../Styles/seriesscore.css";
import { Team } from "csgogsi";

interface Props {
  team: Team;
  show: boolean;
  wonmaps: number;
  wins: number;
}

export default class SeriesScore extends React.Component<Props> {
  render() {
    const { team, show, wonmaps, wins } = this.props;
    if (!team) return null;
    return (
      <div className={`series_score ${team.orientation} ${show ? "show" : "hide"}`}>
        <div className={`bar ${team.side}`}></div>
        <div className={`box_container`}>
          {new Array(wonmaps).fill(0).map((_, i) => (
            <div key={i} className={`wins_box ${wins > i ? "win" : ""} ${team.side}`} />
          ))}
        </div>
        <div className={`bar ${team.side}`}></div>
      </div>
    );
  }
}
