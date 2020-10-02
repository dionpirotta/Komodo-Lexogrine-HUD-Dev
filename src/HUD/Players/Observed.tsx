import React from "react";
import { Player } from "csgogsi-socket";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import TeamLogo from "./../MatchBar/TeamLogo";
import "./../Styles/observed.css";
import { apiUrl } from "./../../api/api";
import { getCountry } from "./../countries";
import Armor from "./../Indicators/Armor";
import Bomb from "./../Indicators/Bomb";
import Defuse from "./../Indicators/Defuse";
import { Veto } from "../../api/interfaces";
import { configs } from "./../../App";

import { HealthCT, HealthT, HealthFullCT, HealthFullT, BulletsCT, BulletsT, SkullCT, SkullT } from "./../../assets/Icons";

class Statistic extends React.PureComponent<{ label: string; value: string | number }> {
  render() {
    return (
      <div className="stat">
        <div className="label">{this.props.label}</div>
        <div className="value">{this.props.value}</div>
      </div>
    );
  }
}

interface Props {
  player: Player | null;
  veto: Veto | null;
  round: number;
}

interface State {
  hide: boolean;
}

export default class Observed extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hide: false,
    };
  }
  componentDidMount() {
    configs.onChange((data: any) => {
      if (!data) return;
      const display = data.display_settings;
      if (!display) return;
      this.setState({ hide: display[`hide_observed_avatar`] });
    });
  }
  getAdr = () => {
    const { veto, player } = this.props;
    if (!player || !veto || !veto.rounds) return null;
    const damageInRounds = veto.rounds
      .map((round) => round.players[player.steamid])
      .filter((data) => !!data)
      .map((roundData) => roundData.damage);
    //console.log(damageInRounds)
    return damageInRounds.reduce((a, b) => a + b, 0) / (this.props.round - 1);
  };
  render() {
    if (!this.props.player) return "";
    const { player } = this.props;
    const country = player.country || player.team.country;
    const weapons = Object.values(player.weapons).map((weapon) => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
    const currentWeapon = weapons.filter((weapon) => weapon.state === "active")[0];
    const grenades = weapons.filter((weapon) => weapon.type === "Grenade");
    const { stats } = player;
    // const ratio = stats.deaths === 0 ? stats.kills : stats.kills / stats.deaths;
    const countryName = country ? getCountry(country) : null;

    // const adr = this.getAdr() !== null ? this.getAdr() : "-";

    return (
      <div className={`observed ${player.team.side}`}>
        <div className="main_row">
          <div className="empty_obs_bar"></div>
          <div className={`under_avatar ${this.state.hide ? "hide" : ""}`}>
            <Avatar steamid={player.steamid} />
          </div>
          <TeamLogo team={player.team} />
          <div className={`obs_bar ${player.team.side}`}></div>
          <div className="username_container">
            <div className="username">{player.name}</div>
            <div className="real_name">{player.realName}</div>
          </div>
          <div className={`obs_bar ${player.team.side}`}></div>
          <div className="flag">{countryName ? <img src={`${apiUrl}files/img/flags/${countryName.replace(/ /g, "-")}.png`} alt={countryName} /> : ""}</div>
          <div className="empty_slot"></div>
        </div>
        <div className="stats_row">
          <div className={`obs_bar ${player.team.side}`}></div>
          <div className="health_armor_container">
            <div className="health_icon icon">
              <img
                src={(player.team.side === "CT" && (player.state.health > 20 ? HealthFullCT : HealthCT)) || (player.team.side === "T" && (player.state.health > 20 ? HealthFullT : HealthT)) || ""}
                alt=""
              />
            </div>
            <div className="health text" style={player.state.health > 20 ? { color: "var(--white-full)" } : { color: "var(--color-bomb)" }}>
              {player.state.health}
            </div>
            <div className="armor_icon icon">
              <Armor player={player} isDefault={false} />
            </div>
            <div className="armor text" style={player.state.armor > 30 ? { color: "var(--white-full)" } : { color: "var(--color-bomb)" }}>
              {player.state.armor}
            </div>
          </div>
          <div className="obs_slot">
            <div className={`obs_slot_bar ${player.team.side}`}></div>
            <div className="obs_slot_number">{player.observer_slot}</div>
          </div>
          <div className="bomb_kit_icon">
            <Bomb player={player} />
            <Defuse player={player} />
          </div>
          <div className="round_kills">
            <div className="skull_icon">
              <img src={player.state.round_kills > 0 ? (player.team.side === "CT" ? SkullCT : SkullT) : ""} alt="" />
            </div>
            <div className="round_kills_text">{player.state.round_kills > 0 ? player.state.round_kills : ""}</div>
          </div>
          <div className="statistics">
            <Statistic label={"K"} value={stats.kills} />
            <Statistic label={"A"} value={stats.assists} />
            <Statistic label={"D"} value={stats.deaths} />
          </div>
          <div className={`grenade_container ${player.team.side}`}>
            {grenades.map((grenade) => [
              <Weapon weapon={grenade.name} active={grenade.state === "active"} isGrenade />,
              grenade.ammo_reserve === 2 ? <Weapon weapon={grenade.name} active={grenade.state === "active"} isGrenade /> : null,
            ])}
            <div className={`no_grenades ${grenades.length > 0 ? "hide" : "show"}`}>NO UTILITY</div>
          </div>
          <div className="ammo">
            {currentWeapon && currentWeapon.type === "Knife" ? (
              <div className={`ammo_knife ${player.team.side}`}>
                <Weapon weapon={currentWeapon.name} active={currentWeapon.state === "active"} />
              </div>
            ) : (
              <div className="ammo_cont">
                <div className="ammo_icon_container">
                  <img src={player.team.side === "CT" ? BulletsCT : BulletsT} alt="" />
                </div>
                <div className="ammo_counter">
                  <div className="ammo_clip" style={currentWeapon && currentWeapon.ammo_clip && currentWeapon.ammo_clip <= 3 ? { color: "var(--color-bomb)" } : { color: "var(--white-full)" }}>
                    {(currentWeapon && currentWeapon.ammo_clip) || "-"}
                  </div>
                  <div className="ammo_reserve">/{(currentWeapon && currentWeapon.ammo_reserve) || "-"}</div>
                </div>
              </div>
            )}
          </div>
          <div className={`obs_bar ${player.team.side}`}></div>
        </div>
      </div>
    );
  }
}
