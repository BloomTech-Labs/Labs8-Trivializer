import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import "./Setting.css";
import axios from "axios";
import URL from "../URLs";

class Setting extends React.Component {
  constructor() {
    super();
    this.state = {
      savedUser: "",
      file: "",
      imagePreviewUrl: "",
      pictureAdded: false,
      changes: false
    };
  }
  componentDidMount() {
    // First Checks if the user logged in through google or not.
    if (!localStorage.getItem("guest")) {
      const auth = {
        headers: {
          Authorization: `${sessionStorage.getItem("jwt")}`
        }
      };
      if (sessionStorage.getItem("google")) {
        let savedUser = JSON.parse(localStorage.getItem("user"));
        this.setState({ savedUser: savedUser });
        // If not google login, there won't be a sessionStorage item to get
      } else {
        let normalUserId = JSON.parse(sessionStorage.getItem("userId"));
        axios
          .get(`https://testsdepl.herokuapp.com/users/users/${normalUserId}`, auth)
          .then(response => {
            this.setState({ savedUser: response.data });
          })
          .catch(err => {
            console.log("err is: ", err.message);
          });
      }
    }
  }
  logout = e => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    this.props.history.push("/");
  };
  fileChangedHandler = e => {
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    };

    reader.readAsDataURL(file);
  };
  uploadHandler = () => {
    console.log(this.state.selectedFile);
  };
  upgradeButton = () => {
    this.props.history.push("/billing");
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
                  Settings
                </li>
              </ol>
            </nav>
          </div>
          {sessionStorage.getItem("jwt") && !localStorage.getItem("guest") ? (
            <div onClick={this.logout} className="top-rightside">
              Sign Out
            </div>
          ) : null}
        </div>

        <div className="main-content">
          <Navbar />
          <div className="content-container setting-container">
            <div className="main-middle setting-content">
              <h1 className="main-middle">Setting</h1>

              {sessionStorage.getItem("google") ? (
                <div className="googleSetting">
                  <div className="google-photo">
                    {savedUser.photoURL ? (
                      <div className="picture">
                        <img
                          className="profile-picture"
                          src={savedUser.photoURL}
                          width="250px"
                          alt="profile-pic"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="signinAccount">
                    <h2>Personal</h2>
                    <div className="signinName">
                      <p>Name: </p>
                      <div>{savedUser ? savedUser.displayName : null}</div>
                    </div>
                    <div className="signinEmail googleEmail">
                      <p>Email: </p>
                      <div>{savedUser ? savedUser.email : null}</div>
                    </div>
                  </div>
                  <div className="signinTier">
                    <h2>Account</h2>
                    <div className="signinFree">
                      <p>Account Tier</p>
                      <div>{savedUser ? <div>Free</div> : "None"}</div>
                    </div>
                    <div className="signinType">
                      <p>Login Type</p>
                      <div>Google Login</div>
                    </div>
                    <div className="signinUpgrade googleUpgrade">
                      <p>Upgrade Account</p>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.upgradeButton}
                      >
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="signinSetting">
                  <div className="signinAccount">
                    <h2>Personal</h2>
                    <div className="signinUserName">
                      <p>Username</p>
                      <input placeholder="Name" value={savedUser ? savedUser[0].userName : null} />
                    </div>
                    <div className="signinEmail">
                      <p>Email </p>
                      <input placeholder="Email" value={savedUser ? savedUser[0].email : null} />
                    </div>
                    <div className="signinPassword">
                      <p>Change Password</p>
                      <input placeholder="Enter new password" />
                    </div>
                  </div>
                  <div className="signinTier">
                    <h2>Account</h2>
                    <div className="signinFree">
                      <p>Account Tier</p>
                      <div>
                        {savedUser ? (
                          <div>{savedUser[0].paid === 0 ? "Free" : "Premium"}</div>
                        ) : (
                          "None"
                        )}
                      </div>
                    </div>
                    <div className="signinUpgrade">
                      <p>Upgrade Account</p>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.upgradeButton}
                      >
                        Upgrade Now
                      </button>
                    </div>
                    <div className="signinPicture">
                      <p>Add/Change Picture</p>
                      {this.state.pictureAdded ? (
                        <div className="upload">
                          {this.state.imagePreviewUrl ? (
                            <img
                              className="uploaded-picture"
                              width="300px"
                              src={this.state.imagePreviewUrl}
                            />
                          ) : null}
                        </div>
                      ) : (
                        <input
                          className="addPicture"
                          type="file"
                          onChange={this.fileChangedHandler}
                        />
                      )}
                    </div>
                  </div>

                  <button
                    type="btn"
                    className="btn btn-success save-button"
                    onClick={this.uploadHandler}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Setting;
