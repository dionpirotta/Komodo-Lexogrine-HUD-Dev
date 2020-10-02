import React from "react";
import { avatars } from "./../../api/avatars";
import { configs } from "./../../App";

interface Props {
  steamid: string;
  height?: number;
  width?: number;
}

interface State {
  hide: boolean;
}

export default class Avatar extends React.Component<Props, State> {
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
      this.setState({ hide: display[`hide_players_avatar`] });
    });
  }

  render() {
    const url = avatars.filter((avatar) => avatar.steamid === this.props.steamid)[0];
    if (!url || (!url.steam.length && !url.custom.length)) {
      return "";
    }
    return (
      <div className={`avatar ${this.state.hide ? "hide" : ""}`}>
        <img src={url.custom || url.steam} alt={"Avatar"} />
      </div>
    );
  }
}
