// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@prb/math/contracts/PRBMathUD60x18.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RentalCashFlowNFT is ERC721 {
    using PRBMathUD60x18 for uint256;
    mapping(uint256 => address) public tokenToRentalAgreement;
    AggregatorV3Interface internal dataFeed;
    using Counters for Counters.Counter;
    //_tokenIds variable has the most recent minted tokenId
    Counters.Counter private _tokenIds;
    //Keeps track of the number of items sold on the marketplace
    Counters.Counter private _itemsSold;
    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
        address rentalAgreementAddress;
    }
    event TokenListedSuccess(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );
    mapping(uint256 => ListedToken) private idToListedToken;

    struct RentalAgreementDetails {
        address landlord;
        address tenant;
        address rentalAgreementAddress;
        uint256 rent;
        uint256 deposit;
        uint256 rentGuarantee;
        string leaseTerm;
        string houseName;
        string houseAddress;
        address tokenAddress;
        uint256 initialPrice;
    }

    mapping(uint256 => RentalAgreementDetails) public idTorentalAgreements;

    constructor() ERC721("RentalCashFlowNFT", "RCF") {
        dataFeed = AggregatorV3Interface(
            0x7422A64372f95F172962e2C0f371E0D9531DF276
        );
    }

    function safeMint(
        address landlord,
        address tenant,
        address rentalAgreementAddress,
        uint256 rent,
        uint256 deposit,
        uint256 rentGuarantee,
        string memory leaseTerm,
        string memory houseName,
        string memory houseAddress,
        address tokenAddress
    ) public returns (uint) {
        //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(landlord, newTokenId);
        tokenToRentalAgreement[newTokenId] = rentalAgreementAddress;
        uint256 price = calculateInitialPrice(rent);
        idTorentalAgreements[newTokenId] = RentalAgreementDetails({
            landlord: landlord,
            tenant: tenant,
            rentalAgreementAddress: rentalAgreementAddress,
            rent: rent,
            deposit: deposit,
            rentGuarantee: rentGuarantee,
            leaseTerm: leaseTerm,
            houseName: houseName,
            houseAddress: houseAddress,
            tokenAddress: tokenAddress,
            initialPrice: price
        });
        //Helper function to update Global variables and emit an event
        createListedToken(newTokenId, price);

        return newTokenId;
    }

    function createListedToken(uint256 tokenId, uint256 price) private {
        //Just sanity check
        require(price > 0, "Make sure the price isn't negative");

        //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            true,
            idTorentalAgreements[tokenId].rentalAgreementAddress
        );

        _transfer(msg.sender, address(this), tokenId);
        //Emit the event for successful transfer. The frontend parses this message and updates the end user
        emit TokenListedSuccess(
            tokenId,
            address(this),
            msg.sender,
            price,
            true
        );
    }

    function calculateInitialPrice(uint256 Rent) public view returns (uint256) {
        uint256 annualRiskFreeInterestRate = getInterestRate();
        // This function calculates the 12month DCF value of the rent using smart contract
        uint256 presentValue = Rent.mul(
            (1e18 - ((1e18 + annualRiskFreeInterestRate).inv().powu(12e18)))
                .div(annualRiskFreeInterestRate)
        );
        return presentValue;
    }

    function getInterestRate() public view returns (uint256) {
        int256 ETH_APR_90d;
        (
            ,
            /* uint80 roundID */ ETH_APR_90d,
            /*uint startedAt*/
            /*uint timeStamp*/
            /*uint80 answeredInRound*/
            ,
            ,

        ) = dataFeed.latestRoundData();
        uint256 annualRiskFreeInterestRate = uint256(ETH_APR_90d) * (1e11);
        return annualRiskFreeInterestRate;
    }

    //This will return all the NFTs currently listed to be sold on the marketplace
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint currentIndex = 0;

        //at the moment currentlyListed is true for all, if it becomes false in the future we will
        //filter out currentlyListed == false over here
        for (uint i = 0; i < nftCount; i++) {
            uint currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }
        //the array 'tokens' has the list of all NFTs in the marketplace
        return tokens;
    }

    //Returns all the NFTs that the current user is owner or seller in
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for (uint i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                uint currentId = i + 1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function executeSale(uint256 tokenId) public payable {
        uint price = idToListedToken[tokenId].price;
        address seller = idToListedToken[tokenId].seller;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        //update the details of the token
        idToListedToken[tokenId].currentlyListed = true;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemsSold.increment();

        //Actually transfer the token to the new owner
        _transfer(address(this), msg.sender, tokenId);
        //approve the marketplace to sell NFTs on your behalf
        approve(address(this), tokenId);
        //Transfer the proceeds from the sale to the seller of the NFT
        payable(seller).transfer(msg.value);
    }

    function getLatestIdToListedToken()
        public
        view
        returns (ListedToken memory)
    {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    function getListedTokenForId(
        uint256 tokenId
    ) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    function getNFTById(
        uint256 tokenId
    ) public view returns (RentalAgreementDetails memory) {
        return idTorentalAgreements[tokenId];
    }
}