import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import "./Setting.css";

class Setting extends React.Component {
  constructor() {
    super();
    this.state = {
      savedUser: ""
    };
  }
  componentDidMount() {
    let savedUser = JSON.parse(localStorage.getItem("user"));
    this.setState({ savedUser: savedUser });
  }

  render() {
    const savedUser = this.state.savedUser;
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
            <div className="picture">
              <img className="profile-picture" src={savedUser.photoURL} alt="profile-pic" />
            </div>
            <div className="name">
              <p>Name: </p>
              <input placeholder="Name" value={savedUser.displayName} />
            </div>
            <div className="email">
              <p>Email: </p>
              <input placeholder="Email" value={savedUser.email} />
            </div>
            <div className="oldpassword">
              <p>Old Password: </p>
              <input type="password" placeholder="password" value={savedUser.uid} />
            </div>
            <div className="newpassword">
              <p>New Password: </p>
              <input placeholder="Enter new password" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Setting;
