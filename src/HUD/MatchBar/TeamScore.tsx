import React from "react";
import * as I from "csgogsi-socket";
import TeamLogo from './TeamLogo';

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
          <TeamLogo team={team} />
          <div className={`bar ${orientation} ${team.side}`}></div>
        </div>
      </>
    );
  }
}
