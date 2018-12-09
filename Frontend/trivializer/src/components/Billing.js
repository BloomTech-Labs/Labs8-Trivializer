import React from "react";
import Navbar from "./Navbar";
import Pay from "./Pay";
import { Link } from "react-router-dom";
import "./Components.css";
import "./Billing.css";

const Billing = props => {
  const logout = e => {
    console.log("props is: ", props);
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    props.history.push("/");
  };

  return (
    <div className="billing-page">
      <div className="top-content">
        <div className="top-leftside">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                Billing
              </li>
            </ol>
          </nav>
        </div>
        {localStorage.getItem("user") && sessionStorage.getItem("jwt") ? (
          <div onClick={logout} className="top-rightside">
            Sign Out
          </div>
        ) : null}
      </div>

      <div className="main-content ">
        <Navbar />

        {/* <h1 className="main-middle">Billing Page</h1> */}
        <div className="content-container">
          <h1>Comparing Plans</h1>
          <div className="billing-content">
            <div className="table">
              <div className="row">
                <div className="first empty" />
                <div className="second free">Free</div>
                <div className="third premium">Premium</div>
              </div>
              <div className="row">
                <div className="first">Can Create Games</div>
                <div className="second">✓</div>
                <div className="third">✓</div>
              </div>

              <div className="row">
                <div className="first">Access to More than 15 Categories of Trivia</div>
                <div className="second">✓</div>
                <div className="third">✓</div>
              </div>
              <div className="row">
                <div className="first">Print & Save Games</div>
                <div className="second">✓</div>
                <div className="third">✓</div>
              </div>

              <div className="row">
                <div className="first">Can Create Unlimited Games</div>
                <div className="second" />
                <div className="third">✓</div>
              </div>
              <div className="row">
                <div className="first">Games Can Have 10+ Questions</div>
                <div className="second" />
                <div className="third">✓</div>
              </div>
            </div>
            <Pay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
