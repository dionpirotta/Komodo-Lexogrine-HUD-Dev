import React from "react";
import "./../Styles/watermark.css";

export default class Watermark extends React.Component<any> {
  render() {
    return (
      <div className={`watermark_container`}>
        <div className="title">Created by Komodo</div>
        <div className="hex">15a07bdc90f582e2cec89b8970d2df94</div>
      </div>
    );
  }
}
