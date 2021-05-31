import React from "react";
import { Team } from "csgogsi-socket";
import "./../Styles/textalert.css";

interface Props {
  team: Team;
  show: boolean;
  text: string;
}

export default class TextAlert extends React.Component<Props> {
  render() {
    const { team, show, text } = this.props;
    if (!team) return null;
    return (
      <div className={`text_area ${team.orientation} ${show ? "show" : "hide"}`}>
        <div className={`bar ${team.side}`}></div>
        <div className={`text_holder ${team.side}`}>{text}</div>
        <div className={`bar ${team.side}`}></div>
      </div>
    );
  }
}
