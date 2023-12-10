// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./RentalAgreement.sol";
import "./RentalCashFlowNFT.sol";

contract RentalFactory {
    mapping(address => RentalAgreement[]) public rentalsByOwner;

    event NewRentalDeployed(
        address contractAddress,
        address landlord,
        address tenant,
        string houseName,
        string houseAddress
    );

    function createNewRental(
        address _tenantAddress,
        uint256 _rent,
        uint256 _deposit,
        uint256 _rentGuarantee,
        address _tokenUsedToPay,
        string memory _houseName,
        string memory _houseAddress,
        string memory _leaseTerm, // Added lease term in function parameters
        address _addressesProvider,
        address _rentalCashFlowNFTaddress
    ) public {
        RentalAgreement newRental = new RentalAgreement(
            msg.sender,
            _tenantAddress,
            _rent,
            _deposit,
            _rentGuarantee,
            _tokenUsedToPay,
            _houseName,
            _houseAddress,
            _leaseTerm,
            _addressesProvider,
            _rentalCashFlowNFTaddress
        );

        emit NewRentalDeployed(
            address(newRental),
            msg.sender,
            _tenantAddress,
            _houseName,
            _houseAddress
        );
        rentalsByOwner[msg.sender].push(newRental);
    }

    function getRentalsCountByOwner(
        address _owner
    ) public view returns (uint256) {
        return rentalsByOwner[_owner].length;
    }
}