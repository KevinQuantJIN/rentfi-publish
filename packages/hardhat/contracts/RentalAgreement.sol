// RentalAgreement.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./RentalCashFlowNFT.sol";

contract RentalAgreement {
    using SafeERC20 for IERC20;
    // Handel the tenancy logic
    address public landlord;
    address public tenant;
    uint256 public rent;
    uint256 public deposit;
    uint256 public rentGuarantee;
    uint256 public nextRentDueTimestamp;
    string public leaseTerm; // Added lease term
    string public houseName;
    string public houseAddress;
    // Handle the token payments
    address public immutable tokenAddress;
    IERC20 public tokenUsedForPayments;
    // Handle the Lending service
    IPoolAddressesProvider public immutable ADDRESSES_PROVIDER;
    IPool public immutable POOL;
    // Handle the NFT logic
    RentalCashFlowNFT public rentalCashFlowNFT;

    event TenantEnteredAgreement(
        uint256 depositLocked,
        uint256 rentGuaranteeLocked,
        uint256 firstMonthRentPaid
    );
    event EndRental(uint256 returnedToTenant, uint256 returnToLandlord);
    event WithdrawUnpaidRent(uint256 withdrawedFunds);

    modifier onlyTenant() {
        require(msg.sender == tenant, "Restricted to the tenant only");
        _;
    }

    modifier onlyLandlord() {
        require(msg.sender == landlord, "Restricted to the landlord only");
        _;
    }

    constructor(
        address _landlord,
        address _tenantAddress,
        uint256 _rent,
        uint256 _deposit,
        uint256 _rentGuarantee,
        address _tokenUsedToPay,
        string memory _houseName,
        string memory _houseAddress,
        string memory _leaseTerm, // Added lease term in constructor
        address _addressesProvider,
        address _rentalCashFlowNFTaddress
    ) {
        require(
            _tenantAddress != address(0),
            "Tenant cannot be the zero address"
        );
        require(_rent > 0, "rent cannot be 0");

        landlord = _landlord;
        tenant = _tenantAddress;
        rent = _rent;
        deposit = _deposit;
        rentGuarantee = _rentGuarantee;
        houseName = _houseName;
        houseAddress = _houseAddress;
        leaseTerm = _leaseTerm; // Setting lease term
        tokenUsedForPayments = IERC20(_tokenUsedToPay);
        tokenAddress = _tokenUsedToPay;
        ADDRESSES_PROVIDER = IPoolAddressesProvider(_addressesProvider);
        POOL = IPool(ADDRESSES_PROVIDER.getPool());
        rentalCashFlowNFT = RentalCashFlowNFT(_rentalCashFlowNFTaddress);
    }

    function enterAgreementAsTenant(
        address _landlordAddress,
        uint256 _deposit,
        uint256 _rentGuarantee,
        uint256 _rent
    ) public onlyTenant {
        require(_landlordAddress == landlord, "Incorrect landlord address");
        require(_deposit == deposit, "Incorrect deposit amount");
        require(
            _rentGuarantee == rentGuarantee,
            "Incorrect rent guarantee amount"
        );
        require(_rent == rent, "Incorrect rent amount");

        uint256 deposits = deposit + rentGuarantee;
        tokenUsedForPayments.safeTransferFrom(tenant, address(this), deposits);

        // Lend the deposit
        tokenUsedForPayments.approve(ADDRESSES_PROVIDER.getPool(), deposits);
        POOL.supply(tokenAddress, deposits, address(this), 0);

        tokenUsedForPayments.safeTransferFrom(tenant, landlord, rent);
        nextRentDueTimestamp = block.timestamp + 4 weeks;

        emit TenantEnteredAgreement(deposit, rentGuarantee, rent);
    }

    function payRent() public onlyTenant {
        require(
            tokenUsedForPayments.allowance(tenant, address(this)) >= rent,
            "Not enough allowance"
        );

        address nftOwner = rentalCashFlowNFT.ownerOf(
            uint256(uint160(address(this)))
        );
        if (nftOwner != landlord) {
            tokenUsedForPayments.safeTransferFrom(tenant, nftOwner, rent);
        } else {
            tokenUsedForPayments.safeTransferFrom(tenant, landlord, rent);
        }

        nextRentDueTimestamp += 4 weeks;
    }

    function withdrawUnpaidRent() public onlyLandlord {
        //CAN TODO: let the investor can withdraw unpaid rent if the tenant delays payment
        require(
            block.timestamp > nextRentDueTimestamp,
            "There are no unpaid rent"
        );

        nextRentDueTimestamp += 4 weeks;
        rentGuarantee -= rent;

        //withdarw the rent from supply
        IERC20 aToken = IERC20(0x29598b72eb5CeBd806C5dCD549490FdA35B13cD8);
        uint256 depositedOnLendingService = aToken.balanceOf(address(this));
        aToken.approve(ADDRESSES_PROVIDER.getPool(), depositedOnLendingService);
        POOL.withdraw(tokenAddress, rent, address(this));

        tokenUsedForPayments.safeTransfer(landlord, rent);
    }

    function endRental(uint256 _amountOfDepositBack) public onlyLandlord {
        require(_amountOfDepositBack <= deposit, "Invalid deposit amount");

        // Withdraw all funds from the lending service
        // (uint256 depositedOnLendingService, , , , , ) = POOL.getUserAccountData(address(this));
        IERC20 aToken = IERC20(0x29598b72eb5CeBd806C5dCD549490FdA35B13cD8);
        uint256 depositedOnLendingService = aToken.balanceOf(address(this));
        aToken.approve(ADDRESSES_PROVIDER.getPool(), depositedOnLendingService);
        POOL.withdraw(tokenAddress, depositedOnLendingService, address(this));

        // Calculate total balance and interest earned
        uint256 totalBalance = tokenUsedForPayments.balanceOf(address(this));
        uint256 interestEarned = totalBalance - (deposit + rentGuarantee);

        // Check if there are enough funds in the contract
        require(
            totalBalance >= deposit + rentGuarantee + interestEarned,
            "Insufficient total funds"
        );

        // Return _amountOfDepositBack to the landlord
        if (_amountOfDepositBack > 0) {
            tokenUsedForPayments.safeTransfer(landlord, _amountOfDepositBack);
        }

        // Calculate remaining amount to return to the tenant
        uint256 remainingToTenant = totalBalance - _amountOfDepositBack;

        // Return the remaining deposit, rent guarantee, and interest to the tenant
        require(remainingToTenant > 0, "No funds left for tenant");
        tokenUsedForPayments.safeTransfer(tenant, remainingToTenant);

        // Reset state variables
        deposit = 0;
        rentGuarantee = 0;
        emit EndRental(remainingToTenant, _amountOfDepositBack);
    }

    function getTotalCollateralBase(
        address _userAddress
    ) external view returns (uint256) {
        (uint256 totalCollateralBase, , , , , ) = POOL.getUserAccountData(
            _userAddress
        );
        return totalCollateralBase;
    }

    function mintRentalAgreementAsNFT() public onlyLandlord {
        //Stop Double Minting Logic
        require(
            rentalCashFlowNFT.ownerOf(uint256(uint160(address(this)))) ==
                landlord,
            "NFT already minted for this agreement"
        );
        //Mint Logic
        rentalCashFlowNFT.safeMint(
            landlord,
            tenant,
            address(this),
            rent,
            deposit,
            rentGuarantee,
            leaseTerm,
            houseName,
            houseAddress,
            tokenAddress
        );
    }
}