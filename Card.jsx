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
    
    var listedText = "";
    if (nftListed == "False") {
        listedText = "Not Listed";
    }
    else {
        listedText = "Listed";
    }

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
    
    //Listing States
    const [sellbtn, setsellbtn] = useState();
    const [listDiv, setListDiv] = useState("hidden");
    const [inputPrice, setInputPrice] = useState();

    function initiateSell(){
        setsellbtn("hidden");
        setListDiv("");
    }

    function handleListChange(event){
        setInputPrice(event.target.value);
    }


    async function handleListing(){
        setListDiv("hidden");
        const err = await opend.listNFT(nftName, Number(inputPrice));
        updateNFTdata();
        setsellbtn("");
    }

    return(
        <div className = "cardX col-3">
            <div className = "row cardImageHolder">
                <img className = "cardImage" src ={url}></img>
            </div>
            <div className = "cardBody">
                Name: {nftName} <br/>
                Price: {nftPrice} KenZ <br/>
                {listedText} <br/>
                <div hidden = {listDiv}>
                    <input onChange = {handleListChange} className = "form-control" type = "number" price = "Enter Price"></input> <br/>
                    <button className = "btn btn-dark" onClick={handleListing}>List</button>
                </div>
                <button hidden = {sellbtn} className = "btn btn-dark" onClick = {initiateSell}>Sell</button>
            </div>
        </div>
    );
}

export default Card;