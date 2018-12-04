import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import "./Setting.css";
import axios from "axios";

class Setting extends React.Component {
  constructor() {
    super();
    this.state = {
      savedUser: ""
    };
  }
  componentDidMount() {
    // First Checks if the user logged in through google or not.
    const auth = {
      headers: {
        Authorization: `${sessionStorage.getItem("jwt")}`
      }
    };
    if (sessionStorage.getItem("google")) {
      let savedUser = JSON.parse(localStorage.getItem("user"));
      this.setState({ savedUser: savedUser });
    } else {
      axios
        .get("https://testsdepl.herokuapp.com/users/users/1", auth)
        .then(response => {
          this.setState({ savedUser: response.data });
        })
        .catch(err => {
          console.log("err is: ", err.message);
        });
    }
  }
  logout = e => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    this.props.history.push("/");
  };

  render() {
    const savedUser = this.state.savedUser;
    console.log("savedUser is: ", savedUser);
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
          {localStorage.getItem("user") || sessionStorage.getItem("jwt") ? (
            <div onClick={this.logout} className="top-rightside">
              Sign Out
            </div>
          ) : null}
        </div>

        <div className="main-content">
          <Navbar />
          <div className="main-middle">
            <h1 className="main-middle">Setting Page</h1>

            {savedUser.photoURL ? (
              <div className="picture">
                <img className="profile-picture" src={savedUser.photoURL} alt="profile-pic" />
              </div>
            ) : null}
            {sessionStorage.getItem("google")
              ? [
                  <div className="name">
                    <p>Name: </p>
                    <input placeholder="Name" value={savedUser ? savedUser.displayName : null} />
                  </div>,
                  <div className="email">
                    <p>Email: </p>
                    <input placeholder="Email" value={savedUser ? savedUser.email : null} />
                  </div>
                ]
              : [
                  <div className="name">
                    <p>Username: </p>
                    <input placeholder="Name" value={savedUser ? savedUser[0].userName : null} />
                  </div>,
                  <div className="email">
                    <p>Email: </p>
                    <input placeholder="Email" value={savedUser ? savedUser[0].email : null} />
                  </div>,
                  <div className="oldpassword">
                    <p>Old Password: </p>
                    <input
                      type="password"
                      placeholder="password"
                      value={savedUser ? savedUser[0].password : null}
                    />
                  </div>
                ]}

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
