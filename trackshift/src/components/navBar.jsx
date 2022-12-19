import React, { Component } from "react";
import * as User from '../services/userService';
import AccountSettings from "./accountSettings";

class NavBar extends Component {
  state = {
    showAccountSettings: false,
  };

  renderSignedInNav() {
    return (
      <div className="col-md-3 text-end">
        <button
          onClick={() => this.toggleAccountSettings()}
          type="button"
          className="btn btn-outline-primary me-2"
        >
          Account Settings
        </button>
        <button
          onClick={this.handleLogout}
          type="button"
          className="btn btn-primary"
        >
          Log out
        </button>
      </div>
    );
  }

  renderSignedOutNav() {
    return (
      <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li>
          <a href="#" className="nav-link px-2 link-secondary">
            Home
          </a>
        </li>
        <li>
          <a href="#" className="nav-link px-2 link-dark">
            Demo
          </a>
        </li>
        <li>
          <a href="#" className="nav-link px-2 link-dark">
            GitHub
          </a>
        </li>
      </ul>
    );
  }

  handleLogout() {
    User.logout();
  }

  toggleAccountSettings = () => {
    const showAccountSettings = !this.state.showAccountSettings;
    this.setState({showAccountSettings});
  };

  render() {
    const { user } = this.props;
    const { showAccountSettings } = this.state;
    return (
      <React.Fragment>
        <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
          <p className="trackshift-logo d-flex align-items-center mr-3 col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
            {" "}
            TrackShift
          </p>
          {user ? this.renderSignedInNav() : this.renderSignedOutNav()}
        </header>
        {showAccountSettings && (
          <AccountSettings onToggleSettings={this.toggleAccountSettings} />
        )}
      </React.Fragment>
    );
  }
}

export default NavBar;
