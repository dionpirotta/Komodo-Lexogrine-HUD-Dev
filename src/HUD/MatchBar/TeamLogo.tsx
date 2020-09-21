import React from "react";
import { Team } from "csgogsi-socket";
import * as I from "../../api/interfaces";

export default class TeamLogo extends React.Component<{ team?: Team | I.Team | null; height?: number; width?: number }> {
  render() {
    if (!this.props.team) return null;
    return <div className={`logo`}>{this.props.team.logo ? <img src={`data:image/jpeg;base64,${this.props.team.logo}`} alt={"Team logo"} /> : ""}</div>;
  }
}
