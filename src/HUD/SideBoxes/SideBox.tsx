import React from "react";
import "./../Styles/sideboxes.css";

import { configs } from "./../../App";

interface Props {
  side: "left" | "right";
}

interface State {
  title: string;
  subtitle: string;
  image?: string;
  imageFull: boolean;
  hide: boolean;
}

export default class SideBox extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: "Title",
      subtitle: "Content",
      imageFull: false,
      hide: false,
    };
  }

  componentDidMount() {
    configs.onChange((data: any) => {
      if (!data) return;
      const display = data.display_settings;
      if (!display) return;
      this.setState({ title: display[`${this.props.side}_title`] });
      this.setState({ subtitle: display[`${this.props.side}_subtitle`] });
      this.setState({ image: display[`${this.props.side}_image`] });
      this.setState({ imageFull: display[`${this.props.side}_image_full_toggle`] });
      this.setState({ hide: display[`hide_${this.props.side}_box`] });
    });
  }

  render() {
    if (this.state.hide === true) return "";
    return (
      <div className={`sidebox ${this.props.side}`}>
        <div className={`title_container ${this.state.imageFull === true ? "rect" : "square"}`}>
          <div className="title">{this.state.title}</div>
          <div className="subtitle">{this.state.subtitle}</div>
        </div>
        <div className={`image_container ${this.state.imageFull === true ? "rect" : "square"}`}>
          {this.state.image ? <img src={`data:image/jpeg;base64,${this.state.image}`} id={`image_left`} alt={"Left"} /> : ""}
        </div>
      </div>
    );
  }
}
