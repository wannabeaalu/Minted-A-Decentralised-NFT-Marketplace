import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Debug "mo:base/Debug";

actor Market{
    //Final deployment starts
    // User Declarations
    private var curUserId: Nat = 0;
    private var emptyList: List.List<Text> = List.nil<Text>();
    private type Cred = {
        email: Text;
        password: Text;
        balance: Nat;
        ownedNFTs: List.List<Text>;
    };
    let users = HashMap.HashMap<Text, Cred>(0, Text.equal, Text.hash);

    //Adding admin account 
    private let admin: Cred = {
        email = "one.srbk@gmail.com";
        password = "srbk";
        balance = 1000000000000000000000;
        ownedNFTs = emptyList;
    };

    users.put("srbk-admin", admin);
    // Finished adding user

    //NFT Declarations
    private var curNFTId: Nat = 0;
    private type NFTData = {
        owner: Text;
        listed: Bool;
        price: Nat;
        image: [Nat8];
    };
    let invalidNFT: NFTData = {
        owner = "";
        listed = false;
        price = 0;
        image = [];
    };
    let nfts = HashMap.HashMap<Text, NFTData>(0, Text.equal, Text.hash);
    var allNfts: List.List<Text> = List.nil<Text>();

    //User Functions
    public func addUser(sent_username: Text, sent_email: Text, sent_password: Text): async Text {

        let newUserName: Text = sent_username # "_" # Nat.toText(curUserId);
        curUserId += 1;
        let newCred: Cred = {
            email = sent_email;
            password = sent_password;
            balance = 10000;
            ownedNFTs = emptyList;
        };
        users.put(newUserName, newCred);

        Debug.print(debug_show(newCred));
        return newUserName;
    };

    public query func autheriseUser(sent_username: Text, sent_password: Text): async Text {
        
        let curUser: Cred = switch(users.get(sent_username)) {
            case null return "Not Found";
            case (?result) result;
        };

        if (curUser.password == sent_password) {
            Debug.print("Autherized");
            return "Autherized";
        }
        else{
            // Debug.print("Invalid");
            return "Invalid Password";
        }
    };

    public func addNFT(sent_username: Text, sent_NFTID: Text): async Text{

        var curUser: Cred = switch(users.get(sent_username)) {
            case null return "Not Found";
            case (?result) result;
        };

        var tempList = (curUser.ownedNFTs);
        tempList := List.push(sent_NFTID, tempList);
        let tempUser: Cred = {
            email = curUser.email;
            password = curUser.password;
            balance = curUser.balance;
            ownedNFTs = tempList;
        };
        users.put(sent_username, tempUser);
       
        Debug.print(debug_show(List.toArray(tempUser.ownedNFTs)));

        return "Success";
    };
    
    public query func getEmail(sent_username: Text): async Text {
        
        var curUser: Cred = switch(users.get(sent_username)) {
            case null return "Not Found";
            case (?result) result;
        };
        return curUser.email;
    };

    public query func getBalance(sent_username: Text): async Text {
        
        var curUser: Cred = switch(users.get(sent_username)) {
            case null return "0";
            case (?result) result;
        };
        return Nat.toText(curUser.balance);
    };

    public query func getNFTs(sent_username: Text): async [Text] {
        var curUser: Cred = switch(users.get(sent_username)) {
            case null return [];
            case (?result) result;
        };

        return List.toArray(curUser.ownedNFTs);
    };


    //NFT Functions
    public func mintNFT(sent_username:Text, sent_NFTName: Text, sent_NFTData: [Nat8]): async Text {
        //Create the NFT
        let newNFTID = sent_NFTName # "#" # Nat.toText(curNFTId);
        let newNFTData: NFTData = {
            owner = sent_username;
            listed = false;
            price = 0;
            image = sent_NFTData;
        };
        curNFTId += 1;
        nfts.put(newNFTID, newNFTData);
        let temp = await addNFT(sent_username, newNFTID);
        allNfts := List.push(newNFTID, allNfts);
        //Debug.print(debug_show(newNFTData));
        return newNFTID;
    };

    public query func showAllNFTs(sent_username: Text): async [Text] {
        return List.toArray(allNfts);
    };

    public query func getNFTOwner(sent_username: Text): async Text {
        var curData: NFTData = switch(nfts.get(sent_username)) {
            case null invalidNFT;
            case (?result) result;
        };

        return curData.owner;
    };

    public query func getNFTListed(sent_username: Text): async Text {
        var curData: NFTData = switch(nfts.get(sent_username)) {
            case null invalidNFT;
            case (?result) result;
        };

        if (curData.listed) {
            return "True";
        }
        else{
            return "False";
        }
    };

    public query func getNFTPrice(sent_username: Text): async Text {
        var curData: NFTData = switch(nfts.get(sent_username)) {
            case null invalidNFT;
            case (?result) result;
        };

        return Nat.toText(curData.price);
    };

    public query func getNFTImage(sent_username: Text): async [Nat8] {
        var curData: NFTData = switch(nfts.get(sent_username)) {
            case null invalidNFT;
            case (?result) result;
        };

        return curData.image;
    };
    
    public func updateBuyerCred(buyer: Text, nftID: Text, price: Nat): async Text {

        var curUser: Cred = switch(users.get(buyer)) {
            case null return "Not Found";
            case (?result) result;
        };

        var tempList = (curUser.ownedNFTs);
        tempList := List.push(nftID, tempList);
        let tempUser: Cred = {
            email = curUser.email;
            password = curUser.password;
            balance = curUser.balance - price;
            ownedNFTs = tempList;
        };
        users.put(buyer, tempUser);
       

        return "Success";
    };

    public func updateSellerCred(seller:Text, nftID: Text, price: Nat): async Text {
    
        var curSeller: Cred = switch(users.get(seller)) {
            case null return "Not Found";
            case (?result) result;
        };
        var sellerNFTs = await getNFTs(seller); 
        var tempArray = Array.filter<Text>(sellerNFTs: [Text], func(tempID: Text) {
            tempID != nftID;
        });
            
        var tempSeller: Cred = {
            email = curSeller.email;
            password = curSeller.password;
            balance = curSeller.balance + price;
            ownedNFTs = List.fromArray(tempArray);
        };
        users.put(seller, tempSeller);

        return "Success";
    };

    public func updateNFTData(nftID: Text, buyer: Text): async Text{

        var curNFT: NFTData = switch(nfts.get(nftID)){
            case null invalidNFT;
            case (?result) result;
        };

        var tempNFT: NFTData = {
            owner = buyer;
            listed = false;
            price = 0;
            image = curNFT.image;
        };
        nfts.put(nftID, tempNFT);
        return "Success";
    };

    public func exchangeNFT(sent_NFTID: Text, sent_buyer: Text): async Text{
        
        let buyer = sent_buyer;
        let seller = await getNFTOwner(sent_NFTID);
        let buyerBalance = await getBalance(buyer);
        let sellerBalance = await getBalance(seller);

        var curNFT: NFTData = switch(nfts.get(sent_NFTID)){
            case null invalidNFT;
            case (?result) result;
        };
        var natPrice = curNFT.price;

        var curBuyer: Cred = switch(users.get(buyer)) {
            case null return "Not Found";
            case (?result) result;
        };
        let natBalace = curBuyer.balance;

        // Debug.print(debug_show("Buyer:", buyer, " seller: ", seller, " buyer balance:", buyerBalance, " seller balance:", sellerBalance));

        //Checking if buyer has enough money
        if ((natBalace < natPrice)){
            Debug.print("Insufficient Balance");

            if(buyer == "srbk-admin"){
                natPrice := 0;
                let buyerErr = await updateBuyerCred(buyer,sent_NFTID, natPrice);
                let sellerErr = await updateSellerCred(seller, sent_NFTID, natPrice);
                let nftErr = await updateNFTData(sent_NFTID, buyer);
                
                return "Success";
            };
            return "Not Enough Balance";
        }
        else{
            let buyerErr = await updateBuyerCred(buyer,sent_NFTID, natPrice);
            let sellerErr = await updateSellerCred(seller, sent_NFTID, natPrice);
            let nftErr = await updateNFTData(sent_NFTID, buyer);
            
            return "Success";
        }
    };
    
    public func listNFT(sent_NFTID: Text, sent_price: Nat): async Text{
        var curNFT: NFTData = switch(nfts.get(sent_NFTID)){
            case null invalidNFT;
            case (?result) result;
        };

        var tempNFT: NFTData = {
            owner = curNFT.owner;
            listed = true;
            price = sent_price;
            image = curNFT.image;
        };
        nfts.put(sent_NFTID, tempNFT);
        return "Success";
    };
}