import React from "react";
import { Routes, Route } from "react-router";
import HomePage from "./components/homePage";
import MigratePage from "./components/migratePage";
import NavBar from "./components/navBar";
import "./App.css";
import "animate.css";

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <Routes>
        <Route path="/migrate" element={<MigratePage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
