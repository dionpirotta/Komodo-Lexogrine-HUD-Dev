import React from "react";
import { Player } from "csgogsi-socket";
import { Bomb as BombIcon, BombT } from "./../../assets/Icons";
export default class Bomb extends React.Component<{ player: Player }> {
  render() {
    const { player } = this.props;
    const weapons = Object.values(player.weapons).map((weapon) => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
    const currentWeapon = weapons.filter((weapon) => weapon.state === "active")[0];
    const c4 = weapons.filter((weapon) => weapon.type === "C4");
    if (c4.length !== 1) return null;
    return (
      <div className={`bomb_indicator`}>
        <img src={c4.length === 1 ? (currentWeapon.type === "C4" ? BombIcon : BombT) : ""} alt="" />
      </div>
    );
  }
}
