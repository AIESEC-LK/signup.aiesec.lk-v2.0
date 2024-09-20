import React from "react";
import "../assets/signup.css";
import aiesec_logo from "../assets/aiesec_logo.webp";
import GV from "../assets/GV.png";
import GTe from "../assets/GTe.png";
import GTa from "../assets/GT.png";

function SignUp() {
  return (
    <div className="signup-con">
      <div className="nav">
        <img src={aiesec_logo} alt="" />
      </div>
      <hr />
      <div className="content">
        <div>
          <div className="text">Sign Up Now</div>
          <div className="buttons">
            <button className="GV">
              <img src={GV} alt="" />
            </button>
            <button className="GT1">
              <img src={GTa} alt="" />
            </button>
            <button className="GT2">
              <img src={GTe} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
