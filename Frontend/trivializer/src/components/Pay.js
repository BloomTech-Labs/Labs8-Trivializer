import React, { Component } from "react";
import Checkout from "./Checkout";
import "./Components.css";
import "./LandingPage.css";

class Pay extends Component {
  render() {
    return (
      <div className="pay-main">
        <Checkout
          className="paybutton"
          name={"Trivializer"}
          description={"Premium"}
          amount={9.99}
        />
      </div>
    );
  }
}

export default Pay;
