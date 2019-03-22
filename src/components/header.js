import React from "react";
import webConfig from "./../../webConfig";
import { NavLink } from "react-router-dom";

import withSession from "./../hoc/withSession";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <header>
        <div className="logo_wrapper">
          <NavLink to="/" onClick={() => this.mobile_nav_button()}>
            <img src={`${webConfig.siteURL}/assets/graphics/logo-img.png`} />
            <span>vegan</span>transitions
          </NavLink>
        </div>

        <div className="header_links_wrapper">
          {this.props.session.getCurrentUser === null && (
            <ul>
              <li className="form_buttons">
                <NavLink className="btn login_button" to="/signin">
                  LogIn
                </NavLink>
              </li>
              <li className="form_buttons">
                <NavLink className="btn signup_button" to="/signup">
                  Signup
                </NavLink>
              </li>
            </ul>
          )}

          {this.props.session.getCurrentUser != null && (
            <div className="your_account">
              <div className="caption">
                <span>
                  Welcome,&nbsp;
                  {this.props.session.getCurrentUser.firstName}{" "}
                  {this.props.session.getCurrentUser.lastName}
                </span>
              </div>
              <NavLink
                to={`/profile/${this.props.session.getCurrentUser.userName}`}
              >
                <div className="wrap">
                  {/* <div className="profile_img">
                  {!this.props.session.getCurrentUser.profileImage && (
                    <img
                      src={`${
                        webConfig.siteURL
                      }/assets/graphics/abstract_patterns/texture.jpg`}
                    />
                  )}
                  {this.props.session.getCurrentUser.profileImage && (
                    <img
                      src={`${webConfig.siteURL}/user-uploads/${
                        this.props.session.getCurrentUser.profileImage
                      }`}
                    />
                  )}
                </div> */}
                </div>
              </NavLink>
            </div>
          )}
        </div>
      </header>
    );
  }
}

export default withSession(Header);
