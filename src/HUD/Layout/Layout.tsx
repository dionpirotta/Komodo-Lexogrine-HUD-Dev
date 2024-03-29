import React from "react";
import TeamBox from "./../Players/TeamBox";
import MatchBar from "../MatchBar/MatchBar";
import Observed from "./../Players/Observed";
import { CSGO, Team } from "csgogsi-socket";
import { Match } from "../../api/interfaces";
import RadarMaps from "./../Radar/RadarMaps";
import Trivia from "../Trivia/Trivia";
import SideBox from "../SideBoxes/SideBox";
import { GSI, actions } from "./../../App";
import MoneyBox from "../SideBoxes/Money";
import UtilityLevel from "../SideBoxes/UtilityLevel";
import Killfeed from "../Killfeed/Killfeed";
import MapSeries from "./../MatchBar/MapSeries";
import Overview from "../Overview/Overview";
import Tournament from "../Tournament/Tournament";
import Watermark from "../Watermark/Watermark";
import AlertsBar from "../MatchBar/AlertsBar";
import BetaTesting from "../Watermark/BetaTesting";

interface Props {
  game: CSGO;
  match: Match | null;
}

interface State {
  winner: Team | null;
  showWin: boolean;
  active: boolean;
  minimal: boolean;
  util: boolean;
}

export default class Layout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      winner: null,
      showWin: false,
      active: true,
      minimal: false,
      util: false,
    };
  }

  componentDidMount() {
    GSI.on("bombPlant", () => {
      this.setState({ util: true }, () => {
        setTimeout(() => {
          this.setState({ util: false });
        }, 5000);
      });
    });
    actions.on("toggleActive", () => {
      this.setState((state) => ({ active: !state.active }));
    });
    actions.on("toggleMinimal", () => {
      this.setState((state) => ({ minimal: !state.minimal }));
    });
  }

  getVeto = () => {
    const { game, match } = this.props;
    const { map } = game;
    if (!match) return null;
    const mapName = map.name.substring(map.name.lastIndexOf("/") + 1);
    const veto = match.vetos.find((veto) => veto.mapName === mapName);
    if (!veto) return null;
    return veto;
  };

  render() {
    const { game, match } = this.props;
    const left = game.map.team_ct.orientation === "left" ? game.map.team_ct : game.map.team_t;
    const right = game.map.team_ct.orientation === "left" ? game.map.team_t : game.map.team_ct;

    const leftPlayers = game.players.filter((player) => player.team.side === left.side);
    const rightPlayers = game.players.filter((player) => player.team.side === right.side);

    const isFreezetime = (game.round && game.round.phase === "freezetime") || game.phase_countdowns.phase === "freezetime";

    return (
      <div className={`layout ${this.state.active ? "active" : "inactive"}`}>
        {/* TODO Create Scoreboard with how each round was won, and then do all players total overviews (ADR, HS etc) */}
        {/* <Overview match={match} map={game.map} players={game.players || []} /> */}
        <MatchBar map={game.map} phase={game.phase_countdowns} bomb={game.bomb} leftPlayers={leftPlayers} rightPlayers={rightPlayers} />

        <AlertsBar map={game.map} phase={game.phase_countdowns} match={match} />
        {/* <SeriesBox map={game.map} phase={game.phase_countdowns} match={match} /> */}
        <Observed player={game.player} veto={this.getVeto()} round={game.map.round + 1} />

        <Tournament />
        <Trivia />
        <Watermark />
        {/* <BetaTesting /> */}

        <div className={`alive_box ${isFreezetime ? "hide" : ""}`}>
          <div className={`bar ${left.side}`}></div>
          <div className={`players_alive`}>
            <div className="title_container">Players Alive</div>
            <div className="counter_container">
              <div className={`team_counter ${left.side}`}>{leftPlayers.filter((player) => player.state.health > 0).length}</div>
              <div className={`vs_counter`}>VS</div>
              <div className={`team_counter ${right.side}`}>{rightPlayers.filter((player) => player.state.health > 0).length}</div>
            </div>
          </div>
          <div className={`bar ${right.side}`}></div>
        </div>

        <div className={`minimal ${this.state.minimal ? "minimal" : "full"}`}>
          <Killfeed />
          <RadarMaps match={match} map={game.map} game={game} />
          <MapSeries teams={[left, right]} match={match} isFreezetime={isFreezetime} map={game.map} />
          <TeamBox team={left} players={leftPlayers} side="left" current={game.player} isFreezetime={isFreezetime} />
          <TeamBox team={right} players={rightPlayers} side="right" current={game.player} isFreezetime={isFreezetime} />

          <div className={"boxes left"}>
            <SideBox side="left" />
            <UtilityLevel team={left.side} side="left" players={game.players} show={isFreezetime || this.state.util} />
            <MoneyBox
              team={left.side}
              side="left"
              loss={left.consecutive_round_losses <= 4 ? left.consecutive_round_losses * 500 + 1400 : 3400}
              equipment={leftPlayers.map((player) => player.state.equip_value).reduce((pre, now) => pre + now, 0)}
              money={leftPlayers.map((player) => player.state.money).reduce((pre, now) => pre + now, 0)}
              show={isFreezetime}
            />
          </div>
          <div className={"boxes right"}>
            <SideBox side="right" />
            <UtilityLevel team={right.side} side="right" players={game.players} show={isFreezetime || this.state.util} />
            <MoneyBox
              team={right.side}
              side="right"
              loss={right.consecutive_round_losses <= 4 ? right.consecutive_round_losses * 500 + 1400 : 3400}
              equipment={rightPlayers.map((player) => player.state.equip_value).reduce((pre, now) => pre + now, 0)}
              money={rightPlayers.map((player) => player.state.money).reduce((pre, now) => pre + now, 0)}
              show={isFreezetime}
            />
          </div>
        </div>
      </div>
    );
  }
}
