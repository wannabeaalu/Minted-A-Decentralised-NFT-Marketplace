import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { opend } from "../../../declarations/opend";
import Card from "./Card";

function Profile() {
    let params = useParams();
    let navigate = useNavigate();
    

    //User Details
    const [curUser, setUser] = useState(params.username);
    const [curEmail, setEmail] = useState("asda");
    const [curBal, setBal] = useState("0");
    const [nfts, setNFTs] = useState([]);

    const [empty, setEmpty] = useState("hidden");

    const collectionId = "/collections/" + curUser;

    //States
    const [mintStart, setMintStart] = useState("");
    const [mint, setMint] = useState("hidden");
    const [mintDiv, setMintDiv] = useState("hidden");

    //Getting the User Creds
    async function updateEmail(){
        var e = await opend.getEmail(curUser);
        setEmail(e);
    }
    async function updateBalance(){
        var b = await opend.getBalance(curUser);
        setBal(b);
    }
    async function updateNFTs(){
        const x = await opend.getNFTs(curUser);
        setNFTs(x);
        console.log(x);
        if(x.length == 0) {
            console.log("Empty Array");
            setEmpty("");
        }
        else{
            console.log("Has Value");
            setEmpty("hidden");
        }
    }
    useEffect(() => {
        updateBalance();
        updateEmail();
        updateNFTs();
    }, []);


    //Mint Details
    const [img, setImg] = useState();
    const [nftName, setnftName] = useState("");

    function handleImg(e) {
        console.log(e.target.files);
        setImg(e.target.files[0]);
    }

    function handleNFTName(event) {
        setnftName(event.target.value);
    }


    //User functions
    function handleMint(){
        setMintStart("hidden");
        setMint("");
        setMintDiv("");
    }

    async function startMint(){
        setMintDiv("hidden");
        const imgArray = await img.arrayBuffer();
        const imgByteData = [...new Uint8Array(imgArray)];
        const res = await opend.mintNFT(curUser, nftName, imgByteData);
        updateNFTs();
        setMintStart("");
        window.location.reload(false);
    }

    //Return Statements
    return (
        <div>
            <div className = "profileNav">
                <Link to = {collectionId}><button className = "btn btn-light navButton">Explore</button></Link>
                <Link to = "/login"><button className = "btn btn-light navButton">Logout</button></Link>     
            </div>
            <h1>Owned NFTs</h1>
            <div className = 'row'>
                <div className = "col-2 profileSection">
                    <h1>Minted</h1>
                    <h3>Profile</h3><br/>
                    <p>Username: {curUser}</p> 
                    <p>Email: {curEmail}</p> 
                    <p>Balance: {curBal}</p>

                    <div hidden = {mintDiv}>
                        <input className = "form-control" onChange = {handleImg} type="file" accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"/> <br/>
                        <input className = "form-control" onChange = {handleNFTName} type = "text" placeholder="Enter NFT Name"></input> <br/>
                        <button className = "btn btn-dark" hidden = {mint} onClick = {startMint} >Mint</button>
                    </div>

                    <button className = "btn btn-dark" hidden = {mintStart} onClick = {handleMint} >Mint NFT</button>

                </div>
                <div className = "col-10 row ownedSection">
                    <h5 hidden = {empty}>You dont own any NFTs. Check out the Explore page or Mine your own NFTs from the Profile Section</h5>
                    {nfts.map((nft, index) => {
                        return (
                            <Card name = {nft} price = "100 KenZ" key = {index}/>
                        );
                    })}
                </div>        
            </div>
        </div>
    );
}

export default Profile;