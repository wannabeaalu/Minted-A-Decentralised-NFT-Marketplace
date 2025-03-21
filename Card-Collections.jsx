import React,  { useEffect, useState }  from "react";
import { opend } from "../../../declarations/opend";
import { useParams, Link, useNavigate } from "react-router-dom";

function Card(props){
    let params = useParams();
    var nftName = props.name;
    const [nftListed, setnftListed] = useState();
    const [nftOwner, setnftOwner] = useState();
    const [nftPrice, setnftPrice] = useState();
    const [url, setUrl] = useState();
    const [err, setErr] = useState("");
    const [button, setButton] = useState("");
    var isHidden = "";

    async function updateNFTdata() {
        let curListed = await opend.getNFTListed(nftName);
        let curOwner = await opend.getNFTOwner(nftName);
        let curPrice = await opend.getNFTPrice(nftName);

        let curImageData = await opend.getNFTImage(nftName);
        const curImgContent = new Uint8Array(curImageData);
        const curImgUrl = URL.createObjectURL(new Blob([curImgContent.buffer], {type: "image/png"}));
        
        setUrl(curImgUrl);
        setnftListed(curListed);
        setnftOwner(curOwner);
        setnftPrice(curPrice);

    }

    useEffect(() => {
        updateNFTdata();
    }, []);
    
    async function buyNFT(){
        setButton("hidden");
        const err = await opend.exchangeNFT(nftName, params.username);
        if(err == "Not Enough Balance"){
            setErr("Not Enough Balance");
        }
        updateNFTdata();
        setButton("");
        console.log(nftName);
    }

    if(nftListed == "False" || nftOwner == params.username) {
        isHidden = "hidden";
        return <p hidden = "hidden"></p>
    }
    else{
        return(
            <div  className = "cardX col-3">
                <div className = "row cardImageHolder">
                    <img className = "cardImage" src ={url}></img>
                </div>
                <div className = "cardBody">
                    Name: {nftName} <br/>
                    Owner: {nftOwner} <br/>
                    Price: {nftPrice} KenZ<br/>
                    <p hidden = {!err}>{err}</p>
                    <button hidden = {button} onClick = {buyNFT} className = "btn btn-dark">Buy</button>
                </div>
            </div>
        );
    }
}

export default Card;