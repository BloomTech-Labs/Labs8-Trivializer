import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

class Setting extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div className="setting-page">
        <div className="top-content">
          <div className="top-leftside">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  Setting
                </li>
              </ol>
            </nav>
          </div>
          <Link className="top-rightside" to="/">
            Sign Out
          </Link>
        </div>

        <div className="main-content">
          <Navbar />
          <div className="main-middle">
            <h1 className="main-middle">Setting Page</h1>
            <div className="name">
              <p>Name: </p>
              <input placeholder="Name" value="Mary's Awesome Trivia" />
            </div>
            <div className="email">
              <p>Email: </p>
              <input placeholder="Email" value="user@gmail.com" />
            </div>
            <div className="oldpassword">
              <p>Old Password: </p>
              <input placeholder="password" value="********" />
            </div>
            <div className="newpassword">
              <p>New Password: </p>
              <input placeholder="password" value="**********" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Setting;
