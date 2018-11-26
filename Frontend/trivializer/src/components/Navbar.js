import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <ul class="vertical-navbar nav flex-column">
      <div class="inner-nav">
        <li class="nav-item">
          <Link to="/gameslist" class="nav-link active">
            Games
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/invoices" className="nav-link">
            Invoices
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
  );
};

export default NavBar;
