import React from "react";
import * as I from "csgogsi-socket";

interface IProps {
  team: I.Team;
  orientation: "left" | "right";
}

export default class TeamScore extends React.Component<IProps> {
  render() {
    const { orientation, team } = this.props;
    return (
      <>
        <div className={`team ${orientation} ${team.side}`}>
          <div className={`bar ${orientation} ${team.side}`}></div>
          <div className="team-score">{team.score}</div>
          <div className={`bar ${orientation} ${team.side}`}></div>
          <div className="team-name">{team.name}</div>
          <div className={`bar ${orientation} ${team.side}`}></div>
          <div className="logo">{team.logo ? <img src={`data:image/jpeg;base64,${team.logo}`} alt={"Team logo"} /> : ""}</div>
          <div className={`bar ${orientation} ${team.side}`}></div>
        </div>
      </>
    );
  }
}
