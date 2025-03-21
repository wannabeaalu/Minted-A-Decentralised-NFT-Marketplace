import React, { useState } from "react";
import {opend} from "../../../declarations/opend";
import { useNavigate, Link } from "react-router-dom";


function Signup() {

    //States
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [button, setButton] = useState("");

    //Error states
    const [error, setError] = useState("");

    //Update Functions
    function updateUsername(event){
        setUsername(event.target.value);
    }
    function updateEmail(event){
        setEmail(event.target.value);
    }
    function updatePassword(event){
        setPass(event.target.value);
    }

    //Using Navigate
    const navigate = useNavigate();

    //Calling Functions
    async function signUp(){
        if (username != "" && email != "" && pass != "") {
            setButton("hidden");
            const newUser = await opend.addUser(username, email, pass);
            console.log(newUser);    
            navigate("/login/" + newUser);
            setButton("");
        }
        else {
            setError("Enter Details First");
            console.log("Enter Details First");
        }
    }

    //Return Statement
    return (
        <div className = "row loginpage">
            <div className = "col-3 login">
                <form>
                    <h3>Create a new account</h3> <br/><br/>
                    <p>{error}</p>
                    <input className = "homeInput" onChange = {updateUsername} type = "text" placeholder = "Username (4 Characters)" maxLength = "4" required></input> <br/>
                    <input className = "homeInput" onChange = {updateEmail} type = "email" placeholder = "Email" required></input> <br/>
                    <input className = "homeInput" onChange = {updatePassword} type = "password" placeholder = "Password" required></input> <br/>
                    <button className = "btn btn-dark loginButton" onClick = {signUp} type = "button" hidden = {button}>Signup</button> <br/><br/><br/><br/>
                    <p>Already have an account?</p> 
                    <Link to = "/login" className = "homeLink"><button className = "btn btn-outline-dark">Login</button></Link> 
                </form>
            </div>
            <div className = "col-9 signimg"></div>  
        </div>    
    );
}

export default Signup;