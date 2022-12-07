import React, { Component } from "react";
import * as User from '../services/userService';

class AccountSettings extends Component {
  state = {
    currentSelection: "Account Info",
    formData: {
      currentPassword: "",
      newPassword: ""
    }
  };

  handleSettingsSelect = (selection) => {
    this.setState({ currentSelection: selection });
  };

  handlePasswordChange = async () => {
    const {formData} = this.state;
    await User.changePassword(formData.currentPassword, formData.newPassword);
  };

  handleInputChange = ({currentTarget: input}) => {
    let data = {...this.state.formData};

    if(input.id === 'currentPassword')
      data.currentPassword = input.value;
    else if(input.id === 'newPassword')
      data.newPassword = input.value;

    this.setState({formData: data});
  };

  renderAccountInfo = () => {
    return <h1>Account Info</h1>;
  };

  renderChangePassword = () => {
    return (
      <div className="d-flex flex-column">
        <div className="form-floating mb-3">
          <input
            id="currentPassword"
            className="form-control"
            type="password"
            onChange={this.handleInputChange}
            placeholder="password"
          />
          <label htmlFor="floatingInput">Current password</label>
        </div>
        <div className="form-floating mb-3">
          <input
            id="newPassword"
            className="form-control"
            type="password"
            onChange={this.handleInputChange}
            placeholder="password"
          />
          <label htmlFor="floatingInput">New password</label>
        </div>
        <button onClick={this.handlePasswordChange} className="w-100 btn btn-lg btn-primary" type="submit">
          Change password
        </button>
      </div>
    );
  };

  renderDeleteAccount = () => {
    return <h1>Delete Account</h1>;
  };

  render() {
    const { onToggleSettings } = this.props;
    const { currentSelection } = this.state;
    const options = ["Account Info", "Change Password", "Delete Account"];
    return (
      <div className="backdrop">
        <div className="overlay d-flex flex-row rounded-4 shadow animate__animated animate__fadeInDown">
          <div className="sidebar d-flex flex-column shadow">
            {/*SIDEBAR*/}
            <ul className="nav nav-pills flex-column mb-auto pt-4">
              {options.map((option) => {
                return (
                  <li key={option} className="nav-item">
                    <a
                      role="button"
                      onClick={() => this.handleSettingsSelect(option)}
                      className={
                        currentSelection === option
                          ? "nav-link active"
                          : "nav-link text-dark"
                      }
                      aria-current="page"
                    >
                      <svg
                        className="bi pe-none me-2"
                        width="16"
                        height="16"
                      ></svg>
                      {option}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="settings d-flex flex-column">
            <div className="d-flex justify-content-end">
              {/*X-BUTTON*/}
              <button
                type="button"
                onClick={() => onToggleSettings()}
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="d-flex lm-4">
              {/*CONTENT*/}
              {currentSelection === "Account Info" && this.renderAccountInfo()}
              {currentSelection === "Change Password" &&
                this.renderChangePassword()}
              {currentSelection === "Delete Account" &&
                this.renderDeleteAccount()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountSettings;
