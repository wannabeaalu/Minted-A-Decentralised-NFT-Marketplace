import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { opend } from "../../../declarations/opend";
import Card from "./Card-Collections";


function Collections() {
    const params = useParams();
    const profileID = "/profile/" + params.username;

    const [nfts, setnfts] = useState([]);
    async function updateNFTs(){
        let x = await opend.showAllNFTs("");
        setnfts(x);
        console.log(x);
    }
    useEffect(() => {
        updateNFTs();
    }, []);

    return (
        <div>
            <div className = "profileNav">
                <Link to = {profileID}><button className = "btn btn-light navButton">Profile</button></Link>
                <Link to = "/login"><button className = "btn btn-light navButton">Logout</button></Link> 
            </div>
            <h1>Explore</h1>
            <div className = "row">
                {nfts.map((nft, index) => {
                    return (
                        <Card name = {nft} price = "100 KenZ" key = {index}/>
                    );
                })}
            </div>
            
        </div>    
    );
}

export default Collections;