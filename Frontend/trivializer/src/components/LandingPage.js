import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import "./Components.css";
import "./LandingPage.css";
import { auth, provider } from "./OAuth/firebase";

const username_regex = /^[a-zA-Z0-9]{4,}$/;
const email_regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
const password_regex = /(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}/;

function validate(field, regex) {
  if (regex.test(field)) {
    return true;
  }
  return false;
}

class LandingPage extends React.Component {
  constructor() {
    super();
    this.state = {
      registerURL: "https://testsdepl.herokuapp.com/users/register",
      signinURL: "https://testsdepl.herokuapp.com/users/login",
      signup_username: "",
      signup_email: "",
      signup_password: "",
      signup_password2: "",
      signin_username: "",
      signin_password: "",
      username_error: "",
      email_error: "",
      password_error: "",
      confirm_error: ""
    };
  }

  redirect = e => {
    // Note from nicky: This redirect function, and the reload in it, is here because I was using <Link> before, and whenever I clicked it to direct it to /gameslist, the background would stay blurred as if the modal is still open. If there's a better fix for it, please let me know :)
    window.location.reload();
    this.props.history.push("/gameslist");
  };

  // Sets users input to local state
  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value, error: "" });
  };

  validateRegister = () => {
    // Returning 1 lets us link to our backend, so we want to return 0 if any error occurs.
    let validation = 1;
    if (!this.state.signup_username) {
      validation = 0;
      this.setState({ username_error: "Username cannot be left blank." });
    } else {
      if (validate(this.state.signup_username, username_regex) !== true) {
        validation = 0;
        this.setState({
          username_error:
            "Needs to be: at least 4 characters, letters and numbers only."
        });
      } else {
        this.setState({ username_error: "" });
      }
    }
    if (!this.state.signup_email) {
      validation = 0;
      this.setState({ email_error: "Please enter an email address." });
    } else {
      if (validate(this.state.signup_email, email_regex) !== true) {
        validation = 0;
        this.setState({
          email_error: "Invalid email format, please try again."
        });
      } else {
        this.setState({ email_error: "" });
      }
    }
    if (!this.state.signup_password) {
      validation = 0;
      this.setState({ password_error: "Please enter a password." });
    } else {
      if (validate(this.state.signup_password, password_regex) !== true) {
        validation = 0;
        this.setState({
          password_error:
            "1 lowercase letter, 1 number, and at least 8 characters needed."
        });
      } else {
        this.setState({ password_error: "" });
      }
    }
    if (
      this.state.signup_password !== this.state.signup_password2 ||
      (!this.state.signup_password && !this.state.signup_password2)
    ) {
      validation = 0;
      this.setState({
        confirm_error: "Passwords do not match, please try again."
      });
    } else {
      this.setState({ confirm_error: "" });
    }

    // Now that we've done all the checks, we can return the 0 or 1 message.
    console.log("validation is: ", validation);
    console.log("validation type is: ", typeof validation);
    return validation;
  };

  validateSignin = () => {
    let validation = 1;
    if (!this.state.signin_username) {
      validation = 0;
      this.setState({ username_error: "Please enter a valid Username." });
    } else {
      if (validate(this.state.signin_username, username_regex) !== true) {
        validation = 0;
        this.setState({
          username_error:
            "Needs to be: at least 4 characters, letters and numbers only."
        });
      } else {
        this.setState({ username_error: "" });
      }
    }
    if (!this.state.signin_password) {
      validation = 0;
      this.setState({ password_error: "Please put in a password." });
    } else {
      this.setState({ password_error: "" });
    }
    return validation;
  };

  // Handles the submit call on the Register modal
  handleSubmit = e => {
    e.preventDefault();

    let credentials;
    let url;

    if (e.target.name === "register" && this.validateRegister()) {
      credentials = {
        username: this.state.signup_username,
        password: this.state.signup_password,
        email: this.state.signup_email
      };
      url = this.state.registerURL;
    } else if (e.target.name === "signin" && this.validateSignin()) {
      credentials = {
        username: this.state.signin_username,
        password: this.state.signin_password
      };
      url = this.state.signinURL;
    } else {
      return;
    }

    axios
      .post(url, {
        username: credentials.username,
        password: credentials.password,
        email: credentials.email || ""
      })
      .then(res => {
        const result = res.data;

        sessionStorage.setItem("jwt", result.token);
        sessionStorage.setItem("user", credentials.username);
        sessionStorage.setItem("userId", result.userId);
        this.redirect();
      })
      .catch(err => {
        console.log("err.response: ", err.response);
        this.setState({
          password_error: "Incorrect password, please try again."
        });
      });
  };

  googleLogin = e => {
    e.preventDefault();
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      window.location.reload();
      this.redirect();
    });
  };

  render() {
    return (
      <div className="landing-page">
        {/* Top Navbar */}
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          {/* Navbar Left Side */}
          <a class="navbar-brand" href="#">
            Bar Trivializer
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon" />
          </button>

          {/* Navbar Right Side */}
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="landingpage-navbar-right navbar-nav ml-auto">
              <li class="navbar-right-list active">
                <div className="navbar-link">How To Play</div>
              </li>
              <li class="navbar-right-list active">
                <div className="navbar-link">FAQ</div>
              </li>
              <li class="navbar-right-list active">
                <div className="navbar-link">About Us</div>
              </li>
              {/* Navbar Signup Link */}
              <li class="navbar-right-list">
                <div className="signup">
                  <div
                    id="new-signup"
                    href="#"
                    className="nav-signup"
                    data-toggle="modal"
                    data-target="#signup"
                  >
                    Sign Up
                  </div>

                  {/* Sign Up Modal */}
                  <div
                    className="modal fade"
                    id="signup"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5
                            className="signup-title modal-title"
                            id="exampleModalLabel"
                          >
                            Sign Up Below
                          </h5>

                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="signup-body modal-body">
                          <form
                            name="register"
                            className="signup-body"
                            onSubmit={this.handleSubmit}
                          >
                            <input
                              name="signup_username"
                              onChange={this.handleInput}
                              value={this.state.signup_username}
                              placeholder="Username"
                            />
                            <label
                              className="validation-label"
                              style={
                                this.state.username_error
                                  ? { visibility: "visible" }
                                  : { visibility: "hidden" }
                              }
                            >
                              {this.state.username_error
                                ? this.state.username_error
                                : null}
                            </label>
                            <input
                              name="signup_email"
                              onChange={this.handleInput}
                              value={this.state.signup_email}
                              placeholder="Email"
                            />
                            <label
                              className="validation-label"
                              style={
                                this.state.email_error
                                  ? { visibility: "visible" }
                                  : { visibility: "hidden" }
                              }
                            >
                              {this.state.email_error
                                ? this.state.email_error
                                : null}
                            </label>
                            <input
                              type="password"
                              name="signup_password"
                              onChange={this.handleInput}
                              value={this.state.signup_password}
                              placeholder="Password"
                            />
                            <label className="validation-label">
                              {this.state.password_error
                                ? this.state.password_error
                                : null}
                            </label>
                            <input
                              type="password"
                              name="signup_password2"
                              onChange={this.handleInput}
                              value={this.state.signup_password2}
                              placeholder="Confirm Password"
                            />
                            <label
                              className="validation-label"
                              style={
                                this.state.confirm_error
                                  ? { visibility: "visible" }
                                  : { visibility: "hidden" }
                              }
                            >
                              {this.state.confirm_error}
                            </label>
                            <button
                              name="register"
                              onClick={this.handleSubmit}
                              className="create-button btn btn-primary"
                            >
                              Create My Account
                            </button>
                          </form>
                        </div>
                        <div
                          className="google-button-signup"
                          onClick={this.googleLogin}
                        >
                          <img
                            src="https://d2k1ftgv7pobq7.cloudfront.net/meta/c/p/res/images/8215f6659adc202403198fef903a447e/sign-in-with-google.svg"
                            onClick={this.googleLogin}
                          />
                          <span className="google-text">
                            {" "}
                            Sign In With Google
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              {/* Navbar Sign In Link */}
              <li class="navbar-right-list">
                <div className="signin">
                  <div
                    id="new-signin"
                    className="nav-signin"
                    href="#"
                    data-toggle="modal"
                    data-target="#signin"
                  >
                    Sign In
                  </div>

                  {/* Sign In Modal */}
                  <div
                    className="modal fade"
                    id="signin"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog" role="document">
                      <div className="login-modal modal-content">
                        <div className="modal-header">
                          <h5
                            className="login-title modal-title"
                            id="exampleModalLabel"
                          >
                            Login Below
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <form
                            name="signin"
                            className="signup-body"
                            onSubmit={this.handleSubmit}
                          >
                            <input
                              name="signin_username"
                              onChange={this.handleInput}
                              value={this.state.signin_username}
                              placeholder="Username"
                            />
                            <label className="validation-label">
                              {this.state.username_error
                                ? this.state.username_error
                                : null}
                            </label>
                            <input
                              type="password"
                              name="signin_password"
                              onChange={this.handleInput}
                              value={this.state.signin_password}
                              placeholder="Password"
                            />
                            <label className="validation-label">
                              {this.state.password_error
                                ? this.state.password_error
                                : null}
                            </label>
                            <button
                              name="signin"
                              onClick={this.handleSubmit}
                              className="login-button btn btn-primary"
                            >
                              Sign In
                            </button>
                          </form>
                        </div>

                        <div
                          className="google-button-signup"
                          onClick={this.googleLogin}
                        >
                          <img src="https://d2k1ftgv7pobq7.cloudfront.net/meta/c/p/res/images/8215f6659adc202403198fef903a447e/sign-in-with-google.svg" />
                          <span className="google-text">
                            {" "}
                            Sign In With Google
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </nav>

        {/* Carousel */}
        <div
          id="carouselExampleIndicators"
          class="carousel slide"
          data-ride="carousel"
        >
          <ol class="carousel-indicators">
            <li
              data-target="#carouselExampleIndicators"
              data-slide-to="0"
              class="active"
            />
            <li data-target="#carouselExampleIndicators" data-slide-to="1" />
            <li data-target="#carouselExampleIndicators" data-slide-to="2" />
          </ol>
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img
                className="carousel-design d-block w-100"
                src="../img/back4.jpg"
                alt="First slide"
              />
            </div>
            <div class="carousel-item">
              <img
                class="carousel-design d-block w-100"
                src="../img/back4.jpg"
                alt="Second slide"
              />
            </div>
            <div class="carousel-item">
              <img
                class="carousel-design d-block w-100"
                src="../img/back4.jpg"
                alt="Third slide"
              />
            </div>
          </div>
          <a
            class="carousel-control-prev"
            href="#carouselExampleIndicators"
            role="button"
            data-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true" />
            <span class="sr-only">Previous</span>
          </a>
          <a
            class="carousel-control-next"
            href="#carouselExampleIndicators"
            role="button"
            data-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true" />
            <span class="sr-only">Next</span>
          </a>
        </div>

        {/* Main Text */}
        <div className="landingpage-main">
          <div className="main-text">
            <h1>Welcome to Bar Trivia</h1>
            <div className="descriptions">
              <p className="description-text">
                Trivializer helps bar trivia hosts create their question sets
                and answer sheets by pulling from a large and free API of trivia
                questions.
              </p>
              <p className="description-text">
                Categories for trivia questions include Entertainment, Science,
                Art, History, and much more. Questions can be filtered by 3
                different difficulty settings.{" "}
              </p>
              <p className="description-text">
                There are free and paid tiers of the app. Users who register get
                a welcome email and can reset their password via email as well.
              </p>
            </div>

            <Link to="/billing" className="main-button btn btn-success">
              Play Without Logging In
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      /*mapped functions here*/
    }
  )(LandingPage)
);
