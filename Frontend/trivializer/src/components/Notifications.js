import React from "react";
import { NotificationContainer } from "react-notifications";

class Example extends React.Component {
  render() {
    return (
      <div>
        {/* <button
          className="btn btn-info"
          onClick={this.createNotification("info")}
        >
          Info
        </button>
        <hr />
        <button
          className="btn btn-success"
          onClick={this.createNotification("success")}
        >
          Success
        </button>
        <hr />
        <button
          className="btn btn-warning"
          onClick={this.createNotification("warning")}
        >
          Warning
        </button>
        <hr /> */}

        <NotificationContainer />
      </div>
    );
  }
}

export default Example;
