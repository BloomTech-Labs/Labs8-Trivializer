import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const NavBar = () => {
  return (
    <div class="main-navigation">
      <nav class="hor-navbar navbar navbar-expand-lg navbar-light bg-light">
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

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <Link to="" class="nav-link active">
                Home
              </Link>
            </li>
            <li class="nav-item">
              <Link to="/gameslist" class="nav-link active">
                Games
              </Link>
            </li>
            <li class="nav-item">
              <Link to="/billing" className="nav-link active">
                Billing
              </Link>
            </li>
            <li class="nav-item">
              <Link to="/setting" className="nav-link active">
                Setting
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div class="vertical-navbar">
        <ul class="nav flex-column">
          <div class="inner-nav">
            <li class="nav-item">
              <Link to="/gameslist" class="nav-link active">
                Games
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/billing" className="nav-link">
                Billing
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/setting" className="nav-link">
                Setting
              </Link>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
