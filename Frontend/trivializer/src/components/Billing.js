import React from "react";
import Navbar from "./Navbar";
import Pay from "./Pay";
import { Link } from "react-router-dom";
import "./Components.css";

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

      <div className="main-content">
        <Navbar />

        {/* <h1 className="main-middle">Billing Page</h1> */}
        <Pay />
      </div>
    </div>
  );
};

export default Billing;
