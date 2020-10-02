import React from "react";
import * as I from "csgogsi-socket";
import "./../Styles/matchbar.css";
import TeamScore from "./TeamScore";
import PhaseTimer from "./PhaseTimer";

interface IProps {
  map: I.Map;
  phase: I.PhaseRaw;
  bomb: I.Bomb | null;
  leftPlayers: I.Player[];
  rightPlayers: I.Player[];
}

export default class TeamBox extends React.Component<IProps> {
  render() {
    const left = this.props.map.team_ct.orientation === "left" ? this.props.map.team_ct : this.props.map.team_t;
    const right = this.props.map.team_ct.orientation === "left" ? this.props.map.team_t : this.props.map.team_ct;
    return (
      <div id={`matchbar`}>
        <TeamScore team={left} orientation={"left"} />
        <PhaseTimer phase={this.props.phase} map={this.props.map} bomb={this.props.bomb} leftPlayers={this.props.leftPlayers} rightPlayers={this.props.rightPlayers} />
        <TeamScore team={right} orientation={"right"} />
      </div>
    );
  }
}
