import React, { Component } from 'react';
import { Routes, Route, Navigate } from "react-router";
import HomePage from "./components/homePage";
import MigratePage from "./components/migratePage";
import NavBar from "./components/navBar";
import jwtDecode from "jwt-decode";
import "./App.css";
import "animate.css";

class App extends Component {
  state = {};

  getCurrentUser() {
    try {
      const jwt = localStorage.getItem('token');
      return jwtDecode(jwt);
    } catch (error) {
      return null;
    }
  }

  render() {
    const user = this.getCurrentUser();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    console.log("user: ", user);
    console.log("urlParams: ", urlParams.get('ki'));
    return (
      <React.Fragment>
        <NavBar user={user}/>
        <Routes>
          <Route
            path="/migrate"
            element={(user) ? <MigratePage urlParams={urlParams}/> : <Navigate to='/'/> }
            />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </React.Fragment>
    );
  }
}

export default App;
