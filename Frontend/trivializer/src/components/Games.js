import React, { Component } from "react";

/**
 * Games Component
 * - renders props for each game
 */
class Games extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(
      "this.props.game.dateCreated: ",
      typeof this.props.game.dateCreated
    );
    console.log("this.props.game.datePlayed: ", this.props.game.datePlayed);
    const created = new Date(parseInt(this.props.game.dateCreated));
    const played = new Date(parseInt(this.props.game.datePlayed));
    console.log("created: ", created);
    console.log("played: ", played);
    return (
      <div className="game">
        <div>{this.props.game.gamename}</div>
        <div className="game-description">{this.props.game.description}</div>
        {/* <div>Add game image</div> */}
        <div>
          Created:{" "}
          {`${created.getMonth() +
            1}-${created.getDate()}-${created.getFullYear()}`}
        </div>
        <div>
          Played:{" "}
          {this.props.game.datePlayed === 0
            ? null
            : `${played.getMonth() + 1}-${played.getDate() +
                1}-${played.getFullYear()}`}
        </div>
      </div>
    );
  }
}

export default Games;
