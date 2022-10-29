import React, { Component } from "react";

class NavBar extends Component {
  renderSignedInNav() {
    return (
      <div className="col-md-3 text-end">
        <button type="button" className="btn btn-outline-primary me-2">
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
    localStorage.removeItem("token");
    window.location = "/";
  }

  render() {
    const { user } = this.props;
    return (
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <a
          className="d-flex align-items-center mr-3 col-md-3 mb-2 mb-md-0 text-dark text-decoration-none"
        >
          {" "}
          TrackShift
        </a>
        {user ? this.renderSignedInNav() : this.renderSignedOutNav()}
      </header>
    );
  }
}

export default NavBar;
