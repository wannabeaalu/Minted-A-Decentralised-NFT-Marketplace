import React, { useState } from "react";
import { opend } from "../../../declarations/opend";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "../../../../node_modules/react-router-dom/dist/index";

function Login(){

    const params = useParams();
    const newUser = params.newuser;
    console.log(newUser);

    //States
    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");
    
    //Error States
    const [errorMsg, setErrorMsg] = useState("");

    //Update Functions
    function updateUsername(event){
        setUsername(event.target.value);
    }
    function updatePassword(event){
        setPass(event.target.value);
    }

    //Using Navigate
    const navigate = useNavigate();

    //Calling Functions
    async function login(){
        console.log(username, pass);
        if (username != "" && pass != ""){
            const error = await opend.autheriseUser(username, pass);
            if (error == "Autherized") {
                navigate("/profile/" + username);
            }
            else{
                setErrorMsg(error);
                console.log(error);
            }
        }
        else {
            setErrorMsg("Fill Details First");
            console.log("Fill Details First.");
        }
    }


    //Return Statement
    return (
        <div className = "row loginpage">
            <div className = "col-3 login">
                <form>
                    <h3>Login to your account</h3> <br/><br/>
                    <p hidden = {!newUser}>Account successfuly created</p>
                    <p hidden = {!newUser}>Your username is {newUser}</p>
                    <p>{errorMsg}</p>
                    <input className = "homeInput" onChange = {updateUsername} type = "text" placeholder = "Username" required></input> <br/>
                    <input className = "homeInput" onChange = {updatePassword} type = "password" placeholder = "Password" required></input> <br/>
                    <button className = "btn btn-dark loginButton" onClick = {login} type = "button" >Login</button> <br/><br/><br/><br/>
                    <p>Dont have an account?</p> 
                    <Link to = "/signup" className = "homeLink"><button className = "btn btn-outline-dark">Signup</button></Link>   
                </form>
            </div>
            <div className = "col-9 logimg"></div>  
        </div>  
    );
}

export default Login;