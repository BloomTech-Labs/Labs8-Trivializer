import React, { Component } from "react";
import "./SpeechBubble.css";

class SpeechBubble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      phrase: this.props.phrase
    };
  }

  render() {
    return (
      <div>
        <div class="speech-bubble-ds">
          <p>
            <strong>{this.props.title}</strong>
          </p>
          <p>{this.props.phrase}</p>
          <div class="speech-bubble-ds-arrow" />
        </div>
      </div>
    );
  }
}

export default SpeechBubble;
