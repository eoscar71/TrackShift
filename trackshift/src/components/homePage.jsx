import React, { Component } from "react";
import NavBar from "./navBar";
import axios from "axios";
import spotify_icon from "../icons/spotify_icon.svg";
import appleMusic_icon from "../icons/appleMusic_icon.svg";

class HomePage extends Component {
  state = {
    formData: {
      email: "",
      password: "",
    },
    currentForm: "register",
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if(this.state.currentForm === 'register')
      this.handleRegister();
    else if(this.state.currentForm === 'login')
      this.handleLogin();
  };

  handleInputChange = ({currentTarget: input}) => {
    let data = {...this.state.formData};

    if(input.type === 'email')
      data.email = input.value;
    else if(input.type === 'password')
      data.password = input.value;

    this.setState({formData: data});
  };

  handleFormChange = (e) => {
    e.preventDefault();
    let form;
    const { currentForm } = this.state;
    if (currentForm === "register") form = "login";
    else if (currentForm === "login") form = "register";

    this.setState({ currentForm: form });
  };

  handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3900/api/users', {
        email: this.state.formData.email,
        password: this.state.formData.password,
      });
      console.log(response);
      localStorage.setItem("token", response.headers["x-auth-token"]);
      localStorage.setItem("hasSpotifyAuth", false);
      localStorage.setItem("hasAppleMusicAuth", false);
      window.location = '/migrate';
    } catch (error) {
      console.log(error);
    }
  };

  handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3900/api/auth/users', {
        email: this.state.formData.email,
        password: this.state.formData.password,
      });
      console.log("response.data : ", response.data);
      localStorage.setItem('token', response.data);
      localStorage.setItem("hasSpotifyAuth", false);
      localStorage.setItem("hasAppleMusicAuth", false);
      localStorage.setItem("hasYoutubeAuth", false);
      window.location = '/migrate';
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div>
        <div className="container col-xl-10 col-xxl-8 px-4 py-5">
          <div className="row align-items-center g-lg-5 pt-1 pb-3">
            <div className="animate__animated animate__fadeInLeft col-lg-7 text-center text-lg-start">
              <h1 className="display-4 fw-bold lh-1 mb-3">Make the shift.</h1>
              <p className="col-lg-10 fs-4">
                Ready to switch music streaming platforms? Make your transition
                easier with TrackShift, a free cross-platform playlist migration
                tool.
              </p>
            </div>
            <div className="animate__animated animate__fadeInRight col-md-10 mx-auto col-lg-5">
              <form
                onSubmit={this.handleSubmit}
                className="p-4 p-md-5 border rounded-3 bg-light"
              >
                <div className="form-floating mb-3">
                  <input
                    id="floatingInput"
                    className="form-control"
                    type="email"
                    onChange={this.handleInputChange}
                    placeholder="name@example.com"
                  />
                  <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    id="floatingPassword"
                    className="form-control"
                    type="password"
                    onChange={this.handleInputChange}
                    placeholder="Password"
                  ></input>
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="checkbox mb-3">
                  <label>
                    <input
                      className="remember-me"
                      type="checkbox"
                      value="remember-me"
                    />
                    Remember me
                  </label>
                </div>
                <button className="w-100 btn btn-lg btn-primary" type="submit">
                  {this.state.currentForm === "register"
                    ? "Sign up"
                    : "Sign in"}
                </button>
                <hr className="my-4" />
                {this.state.currentForm === "register" && (
                  <small className="text-muted">
                    Already have an account?{" "}
                    <a href="" onClick={this.handleFormChange}>
                      Sign-in.
                    </a>
                  </small>
                )}
                {this.state.currentForm === "login" && (
                  <small className="text-muted">
                    Don't have an account?{" "}
                    <a href="" onClick={this.handleFormChange}>
                      Sign-up.
                    </a>
                  </small>
                )}
              </form>
            </div>
          </div>
        <div className="d-flex pt-3 justify-content-center align-items-center">
          <h5 className="animate__animated animate__fadeIn inline-block">
            Currently supports:
          </h5>
        </div>
        <div className="d-flex justify-content-center">
          <img
            className="animate__animated animate__fadeInUp"
            src={spotify_icon}
          />
          <img
            className="animate__animated animate__fadeInUp"
            src={appleMusic_icon}
          />
        </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
