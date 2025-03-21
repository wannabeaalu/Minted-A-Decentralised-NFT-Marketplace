import React, {useState} from "react";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";

import Collections from "./Collections";
import Home from "./Home";
import Login from "./Login";
import Profile from "./Profile";
import Signup from "./Signup";

function App() {

    return (
        <Router>
            <Routes>
                <Route exact path = "/" element = {<Home /> }></Route>
                <Route exact path = "/signup" element = {<Signup />}></Route>
                <Route exact path = "/login" element = {<Login />}></Route>
                <Route exact path = "/login/:newuser" element = {<Login />}></Route>
                <Route exact path = "/collections/:username" element = { <Collections /> }></Route>
                <Route exact path = "/profile/:username" element = {<Profile />} ></Route>
            </Routes>
        </Router>   
    );
}

export default App;