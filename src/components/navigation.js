import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import webConfig from "./../../webConfig";
import withSession from "./../hoc/withSession";
import classNames from "classnames";

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNavState: false,
      displayMenu: false
    };
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      if (window.outerWidth >= 1024) {
        this.setState({
          mobileNavState: false
        });
      }
    });
  }

  mobile_nav_button() {
    const vWidth = window.outerWidth;
    if (vWidth <= 1024) {
      this.setState({
        mobileNavState: !this.state.mobileNavState
      });
    }
  }

  render() {
    return (
      <nav className="signbar_nav">
        <ul>
          <li>
            <NavLink to="/" onClick={() => this.mobile_nav_button()}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/transitions" onClick={() => this.mobile_nav_button()}>
              Transitions
            </NavLink>
          </li>
          <li />
          <li>
            <NavLink to="/articles" onClick={() => this.mobile_nav_button()}>
              Articles
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/famous-vegans"
              onClick={() => this.mobile_nav_button()}
            >
              Famous Vegans
            </NavLink>
          </li>
          <li>
            <NavLink to="/videos" onClick={() => this.mobile_nav_button()}>
              Videos
            </NavLink>
          </li>
          <li>
            <NavLink to="/books" onClick={() => this.mobile_nav_button()}>
              Books
            </NavLink>
          </li>
        </ul>
        {/* {this.props.session.getCurrentUser === null && (
          
        )} */}

        {/* {this.props.session.getCurrentUser != null && (
          <ul>
            <li>
              <NavLink to="/users" onClick={() => this.mobile_nav_button()}>
                <i className="fas fa-users" />
                Users
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" onClick={() => this.mobile_nav_button()}>
                <i className="fas fa-tachometer-alt" />
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to={`/profile/${this.props.session.getCurrentUser.userName}`}
                onClick={() => this.mobile_nav_button()}
              >
                <i className="fas fa-user-circle" />
                View my Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/edit-profile"
                onClick={() => this.mobile_nav_button()}
              >
                <i className="fas fa-user-cog" />
                Edit Profile
              </NavLink>
            </li>
            <li>
              <NavLink to="/account" onClick={() => this.mobile_nav_button()}>
                <i className="fas fa-user-circle" />
                Update Account
              </NavLink>
            </li>
            <li>
              <NavLink to="/signout" onClick={() => this.mobile_nav_button()}>
                <i className="fas fa-sign-out-alt" />
                LogOut
              </NavLink>
            </li>
          </ul>
        )}

        <ul>
          <li>
            <NavLink
              to="/cookie-policy"
              onClick={() => this.mobile_nav_button()}
            >
              <i className="fas fa-cookie-bite" />
              Cookie Policy
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/privacy-policy"
              onClick={() => this.mobile_nav_button()}
            >
              <i className="fas fa-user-secret" />
              Privacy Policy
            </NavLink>
          </li>
          <li>
            <NavLink to="/terms" onClick={() => this.mobile_nav_button()}>
              <i className="fas fa-handshake" />
              T&amp;C's
            </NavLink>
          </li>
        </ul> */}
      </nav>
    );
  }
}

export default withSession(Navigation);
