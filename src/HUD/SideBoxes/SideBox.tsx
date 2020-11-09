import React from "react";
import "./../Styles/sideboxes.css";

import { configs } from "./../../App";
import isSvg from '../isSvg';

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
    const { image, title, subtitle, imageFull, hide} = this.state;
    if (hide === true) return "";
    const encoding = image && isSvg(Buffer.from(image, 'base64')) ? 'svg+xml':'png';
    return (
      <div className={`sidebox ${this.props.side}`}>
        <div className={`title_container ${imageFull === true ? "rect" : "square"}`}>
          <div className="title">{title}</div>
          <div className="subtitle">{subtitle}</div>
        </div>
        <div className={`image_container ${this.state.imageFull === true ? "rect" : "square"}`}>
        {this.state.image ? <img src={`data:image/${encoding};base64,${image}`} id={`image_left`} alt={'Left'}/>:''}
        </div>
      </div>
    );
  }
}
