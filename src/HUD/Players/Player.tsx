import React from "react";
import { Player, WeaponRaw, Map } from "csgogsi-socket";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import Armor from "./../Indicators/Armor";
import Bomb from "./../Indicators/Bomb";
import Defuse from "./../Indicators/Defuse";
import { Skull, SkullCT, SkullT } from "./../../assets/Icons";
import { GSI } from "../../App";

interface IProps {
  player: Player;
  isObserved: boolean;
  isFreezetime: boolean;
}

interface IState {
  startRoundMoney: number;
}

export default class PlayerBox extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      startRoundMoney: 800,
    };
  }

  componentDidMount() {
    GSI.on("roundEnd", () => {
      this.setState({ startRoundMoney: this.props.player.state.money });
    });
  }

  render() {
    const { player } = this.props;
    const weapons: WeaponRaw[] = Object.values(player.weapons).map((weapon) => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
    const primary = weapons.filter((weapon) => !["C4", "Pistol", "Knife", "Grenade"].includes(weapon.type))[0] || null;
    const secondary = weapons.filter((weapon) => weapon.type === "Pistol")[0] || null;
    const knife = weapons.filter((weapon) => weapon.type === "Knife")[0] || null;
    const grenades = weapons.filter((weapon) => weapon.type === "Grenade");
    const isLeft = player.team.orientation === "left";
    const isDead = player.state.health === 0 ? true : false;
    return (
      <div className={`player ${isDead ? "dead" : ""}`}>
        <div className="player_data">
          <div className={`player_side_bar ${player.team.side}`} />
          <Avatar steamid={player.steamid} showSkull={false} />
          <div className="dead-stats">
            <div className="labels">
              <div className="stat-label">K</div>
              <div className="stat-label">A</div>
              <div className="stat-label">D</div>
            </div>
            <div className="values">
              <div className="stat-value">{player.stats.kills}</div>
              <div className="stat-value">{player.stats.assists}</div>
              <div className="stat-value">{player.stats.deaths}</div>
            </div>
          </div>
          <div className="player_stats">
            <div className="row">
              <div className="health">{player.state.health}</div>
              <div className="username">
                {isLeft ? player.observer_slot + "|" : ""} {player.name} {!isLeft ? "|" + player.observer_slot : ""}
                {primary || secondary ? <Weapon weapon={primary ? primary.name : secondary.name} active={primary ? primary.state === "active" : secondary.state === "active"} /> : ""}
                {!primary && !secondary && knife ? <Weapon weapon={knife ? knife.name : ""} active={knife ? knife.state === "active" : false} /> : ""}
              </div>
              <div className="hp_background_2" style={{ width: `${player.state.health}%` }}></div>
              <div className="hp_background" style={{ width: `${player.state.health}%` }}></div>
            </div>
            <div className={`row ${this.props.isObserved ? "obs" : ""}`}>
              <div className="armor_and_utility">
                <Bomb player={player} />
                <Armor player={player} isDefault={false} />
                <Defuse player={player} />
              </div>
              <div className="money">${player.state.money}</div>
              <div className="round_kills">
                <div className="round_kills_skull">
                  <img src={player.state.round_kills > 0 ? (isDead ? Skull : player.team.side === "CT" ? SkullCT : SkullT) : ""} />
                </div>
                <div className="round_kills_count">{player.state.round_kills > 0 ? player.state.round_kills : ""}</div>
              </div>
              <div className="grenades">
                {grenades.map((grenade) => [
                  <Weapon key={`${grenade.name}-${grenade.state}`} weapon={grenade.name} active={grenade.state === "active"} isGrenade />,
                  grenade.ammo_reserve === 2 ? <Weapon key={`${grenade.name}-${grenade.state}-double`} weapon={grenade.name} active={grenade.state === "active"} isGrenade /> : null,
                ])}
              </div>
              <div className="secondary_weapon">{primary && secondary ? <Weapon weapon={secondary.name} active={secondary.state === "active"} /> : ""}</div>
            </div>
          </div>
        </div>
        <div className={`observing ${this.props.isObserved ? "active" : ""}`} />
        <div className={`freeze-time ${isLeft ? "left" : "right"} ${this.props.isFreezetime ? "" : "hide"}`}>
          <div className="stats">
            <div className="labels">
              <div className="stat-label">K</div>
              <div className="stat-label">A</div>
              <div className="stat-label">D</div>
            </div>
            <div className="values">
              <div className="stat-value">{player.stats.kills}</div>
              <div className="stat-value">{player.stats.assists}</div>
              <div className="stat-value">{player.stats.deaths}</div>
            </div>
          </div>
          <div className={`spending`}>
            <div className={`spent`}>-${Math.abs(player.state.money - this.state.startRoundMoney)}</div>
          </div>
        </div>
      </div>
    );
  }
}
