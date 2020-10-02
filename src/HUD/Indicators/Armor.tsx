import React from "react";
import { Player } from "csgogsi-socket";
import {
  ArmorFullCT,
  ArmorFullT,
  ArmorFull,
  ArmorHalfCT,
  ArmorHalfT,
  ArmorHalf,
  ArmorHalfHelmetCT,
  ArmorHalfHelmetT,
  ArmorHalfHelmet,
  ArmorHelmetCT,
  ArmorHelmetT,
  ArmorHelmet,
  ArmorNoneCT,
  ArmorNoneT,
  ArmorNone,
} from "./../../assets/Icons";

const armor = {
  kevlar: {
    CT: {
      half: ArmorHalfCT,
      full: ArmorFullCT,
    },
    T: {
      half: ArmorHalfT,
      full: ArmorFullT,
    },
    Default: {
      half: ArmorHalf,
      full: ArmorFull,
    },
  },
  helmet: {
    CT: {
      half: ArmorHalfHelmetCT,
      full: ArmorHelmetCT,
    },
    T: {
      half: ArmorHalfHelmetT,
      full: ArmorHelmetT,
    },
    Default: {
      half: ArmorHalfHelmet,
      full: ArmorHelmet,
    },
  },
  none: {
    CT: ArmorNoneCT,
    T: ArmorNoneT,
    Default: ArmorNone,
  },
};

export default class Armor extends React.Component<{ player: Player; isDefault: boolean }> {
  render() {
    const { player } = this.props;
    const side = this.props.isDefault ? "Default" : player.team.side;
    const armor_state = player.state.armor > 30 ? "full" : "half";
    return (
      <div className={`armor_indicator`}>
        <img src={player.state.armor > 0 ? armor[player.state.helmet ? "helmet" : "kevlar"][side][armor_state] : armor["none"][side]} alt="" />
      </div>
    );
  }
}
