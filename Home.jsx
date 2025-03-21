import React from "react";
import { Link } from "react-router-dom";
import Intro from "./Intro";
import Login from "./Login";
import Signup from "./Signup";


function Home() {

    return (
        <div className = "home">
            <Login />
        </div>
    );
}
export default Home;