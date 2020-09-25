import React from "react";
import { actions } from "./../../App";
import { avatars } from "./../../api/avatars";

interface Props {
  steamid: string;
  height?: number;
  width?: number;
}

interface State {
  show: boolean;
}

export default class Avatar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      show: true,
    };
  }

  componentDidMount() {
    actions.on("toggleAvatar", () => {
      this.setState((state) => ({ show: !state.show }));
    });
  }

  render() {
    const url = avatars.filter((avatar) => avatar.steamid === this.props.steamid)[0];
    if (!url || (!url.steam.length && !url.custom.length)) {
      return "";
    }
    return (
      <div className={`avatar ${!this.state.show ? "hide" : ""}`}>
        <img src={url.custom || url.steam} alt={"Avatar"} />
      </div>
    );
  }
}
