import React from "react";
import { Player } from "csgogsi-socket";
import { DefuseCT as DefuseIcon } from "./../../assets/Icons";
export default class Defuse extends React.Component<{ player: Player }> {
  render() {
    const { player } = this.props;
    if (!player.state.health || !player.state.defusekit) return null;
    return (
      <div className={`defuse_indicator`}>
        <img src={DefuseIcon} alt="" />
      </div>
    );
  }
}
