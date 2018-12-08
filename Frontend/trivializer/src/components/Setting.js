import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import "./Setting.css";
import axios from "axios";
import "./Components.css";

class Setting extends React.Component {
  constructor() {
    super();
    this.state = {
      savedUser: "",
      file: "",
      imagePreviewUrl: ""
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
          {localStorage.getItem("user") && sessionStorage.getItem("jwt") ? (
            <div onClick={this.logout} className="top-rightside">
              Sign Out
            </div>
          ) : null}
        </div>

        <div className="main-content">
          <Navbar />
          <div className="content-container">
            <div className="main-middle">
              <h1 className="main-middle">Setting</h1>

              {sessionStorage.getItem("google") ? (
                [
                  <div className="googleSetting">
                    <div>
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
                    ,
                    <div className="name">
                      <p>Name: </p>
                      <div>{savedUser ? savedUser.displayName : null}</div>
                    </div>
                    ,
                    <div className="email">
                      <p>Email: </p>
                      <div>{savedUser ? savedUser.email : null}</div>
                    </div>
                  </div>
                ]
              ) : (
                <div className="signinSetting">
                  <div className="siginAccount">
                    <div className="signinUserName">
                      <p>Username</p>
                      <input placeholder="Name" value={savedUser ? savedUser[0].userName : null} />
                    </div>
                    <div className="signinEmail">
                      <p>Email: </p>
                      <input placeholder="Email" value={savedUser ? savedUser[0].email : null} />
                    </div>
                    <div className="signinPassword">
                      <p>Change Password</p>
                      <input placeholder="Enter new password" />
                    </div>
                  </div>
                  <div className="signinTier">
                    <div className="signinType">
                      <p>Account Type</p>
                      <div>
                        {savedUser ? (
                          <div>Account Status: {savedUser[0].paid === 0 ? "Free" : "Premium"}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className="signinPicture">
                      <p>Picture</p>
                      <input type="file" onChange={this.fileChangedHandler} />
                      <div className="upload">
                        {this.state.imagePreviewUrl ? (
                          <img
                            className="uploaded-picture"
                            width="300px"
                            src={this.state.imagePreviewUrl}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <button onClick={this.uploadHandler}>Save Changes</button>
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
