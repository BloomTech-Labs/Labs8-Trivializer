import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./Components.css";

const Faqs = () => {
  return (
    <div className="faqs-page">
      <div className="top-content">
        <div className="top-leftside">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                FAQ's
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="main-content">
        <Navbar />
        <div>
          <h1>FAQ's</h1>
          <div>
            <p className="questions">Why should I sign up for an account? </p>
            <p>
              Signing up for an account lets you keep the games on your account. If you get
              questions that you really like, and you want to save them, signing up for an account
              lets you do that.
            </p>
          </div>
          <div className="questions">
            <p>What do I get with a Paid membership? </p>
            <p>
              With a free account, you can only create at most 3 games. A paid membership lets you
              create as many games as you want.
            </p>
          </div>
          <div className="questions">
            <p>How long does my paid membership last?</p>
            <p>Forever! This is a buy one time membership. </p>
          </div>
          <div className="questions">
            <p>How do I add games?</p>
            <p>
              You can add games by clicking on the "Games" Tab and hitting +, and type in a game
              name to get started. The calendar is to give you a sense of when you want to play.{" "}
            </p>
          </div>
          <div className="questions">
            <p>Why do my games go away? </p>
            <p>If you are not logged in, the games don't save to an account.</p>
          </div>
          <div className="questions">
            <p>Can I change the ordering of the questions?</p>
            <p>If you would like the ordering of questions to be different</p>
          </div>
          <div className="questions">
            <p>How do I change just 1 question if it's one I don't like?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faqs;
