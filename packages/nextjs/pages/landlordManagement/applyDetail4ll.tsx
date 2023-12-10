import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useRouter } from "next/router";
import { APPLY } from "../types";
import { UserTypeContext } from "~~/contexts/useGlobalInfo";
import { useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { useContractWrite } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";

const ApplyDetail4ll = () => {
  const { selectedApply4ll } = useContext(UserTypeContext);
  const status = selectedApply4ll?.status;
  const router = useRouter();
  const tokenusedtoPay = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357";
  const addressProvider = "0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A";

  const rentalNFTaddr = "0x6e3d3af77a9fA2e6d0B9055126eB598d22E08a45";

  const [newRentalAddr, setNewRentalAddr] = useState<string | undefined>("");
  //create rentalagreement
  const {
    writeAsync: createRentalAgreement,
    isLoading:isRentalCreatedLoading,
    status:isRentalCreated,
    isMining
  } = useScaffoldContractWrite({
    contractName: "RentalFactory",
    functionName: "createNewRental",
    args: [
      selectedApply4ll?.tenantAddress,
      BigInt(selectedApply4ll!.rent),
      BigInt(selectedApply4ll!.deposit),
      BigInt(selectedApply4ll!.gurantee),
      tokenusedtoPay,
      selectedApply4ll?.houseName,
      selectedApply4ll?.houseAddress,
      `${selectedApply4ll?.leaseStartTime}&&${selectedApply4ll?.leaseEndTime}`,
      addressProvider,
      rentalNFTaddr,
    ],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });
  const {
    writeAsync: safeMint,
    isLoading:isMintLoading,
  } = useScaffoldContractWrite({
    contractName: "RentalCashFlowNFT",
    functionName: "safeMint",
    args: [
      selectedApply4ll?.landlord,
      selectedApply4ll?.tenantAddress,
      selectedApply4ll?.contractAddr,
      BigInt(selectedApply4ll!.rent),
      BigInt(selectedApply4ll!.deposit),
      BigInt(selectedApply4ll!.gurantee),
      `${selectedApply4ll?.leaseStartTime}&&${selectedApply4ll?.leaseEndTime}`,
      selectedApply4ll?.houseName,
      selectedApply4ll?.houseAddress,
      tokenusedtoPay,
    ],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });
 
  //调用agreement的endRental方法
  const {isLoading:isEndRentalLoading,writeAsync:endrent}=useContractWrite({
    address:selectedApply4ll?.contractAddr,
    abi:deployedContracts['11155111'].RentalAgreement.abi,
    functionName:'endRental',
  })

  //调用agreement的withdraw方法
  const {isLoading:isWithdrawLoading,writeAsync:withdraw}=useContractWrite({
    address:selectedApply4ll?.contractAddr,
    abi:deployedContracts['11155111'].RentalAgreement.abi,
    functionName:'withdrawUnpaidRent',
  })

  //create event subsecriber to access the rental agreement address
  useScaffoldEventSubscriber({
    contractName: "RentalFactory",
    eventName: "NewRentalDeployed",
    // The listener function is called whenever a GreetingChange event is emitted by the contract.
    // Parameters emitted by the event can be destructed using the below example
    // for this example: event GreetingChange(address greetingSetter, string newGreeting, bool premium, uint256 value);
    listener: logs => {
      logs.map(log => {
        const { contractAddress } = log.args;
        console.log("📡 new rental create event", contractAddress);
        setNewRentalAddr(contractAddress);
      });
    },
  });
  useEffect(() => {
    renderStatusMessage();
    useScaffoldEventSubscriber;
  });
  const renderStatusMessage = () => {
    switch (status) {
      case "applied":
        return (
          <div>
            <button className="btn btn-success" onClick={handleApply}>
              Create Contract
            </button>
            <p className="text-2xl font-bold font-sans">Waiting for your confirmation.</p>
            <p className="py-6 text-black">House Name:{selectedApply4ll?.houseName}</p>
            <p className="py-6 text-black">House Address:{selectedApply4ll?.houseAddress}</p>
            <p className="py-6 text-black">Tenant:{selectedApply4ll?.tenantAddress}</p>
            <p className="py-6 text-black">Rent:{selectedApply4ll?.rent}DAI</p>
            <p className="py-6 text-black">Gurantee:{selectedApply4ll?.gurantee}DAI</p>
            <p className="py-6 text-black">Deposit:{selectedApply4ll?.deposit}DAI</p>
            <p className="py-6 text-white">Leasing Start Time:{selectedApply4ll?.leaseStartTime}</p>
            <p className="py-6 text-white">Leasing End Time:{selectedApply4ll?.leaseEndTime}</p>
          </div>
        );

      case "created":
        return (
          <div>
            <p className="text-2xl font-bold font-sans">You has created a contract. Waiting for tenant's approval:</p>
            <p className="py-6 text-black">House Name:{selectedApply4ll?.houseName}</p>
            <p className="py-6 text-black">House Address:{selectedApply4ll?.houseAddress}</p>
            <p className="py-6 text-black">Tenant:{selectedApply4ll?.tenantAddress}</p>
            <p className="py-6 text-black">Rent:{selectedApply4ll?.rent}DAI</p>
            <p className="py-6 text-black">Gurantee:{selectedApply4ll?.gurantee}DAI</p>
            <p className="py-6 text-black">Deposit:{selectedApply4ll?.deposit}DAI</p>
            <p className="py-6 text-white">Leasing Start Time:{selectedApply4ll?.leaseStartTime}</p>
            <p className="py-6 text-white">Leasing End Time:{selectedApply4ll?.leaseEndTime}</p>
            <p>Contract Address: {selectedApply4ll?.contractAddr}</p>
          </div>
        );
      case "signed":
        return (
          <div>
            <button className="btn btn-success m-2" onClick={handleWithdraw}>
              Withdraw unpaid rent
            </button>
            <button className="btn btn-success m-2" onClick={handleEndRental}>
              End Rental
            </button>
            <button className={`btn btn-primary ${selectedApply4ll?.status==='minted'?"disabled":""}`} onClick={handleMint}>
              {selectedApply4ll?.status==='minted'?"MINTED":"Mint NFT"}
            </button>
            <p className="text-2xl font-bold font-sans">
              Tenant has signed contract for {selectedApply4ll?.houseName}.
            </p>
            <p className="py-6 text-black">House Address:{selectedApply4ll?.houseAddress}</p>
            <p className="py-6 text-black">Tenant:{selectedApply4ll?.tenantAddress}</p>
            <p className="py-6 text-black">Rent:{selectedApply4ll?.rent}DAI</p>
            <p className="py-6 text-black">Gurantee:{selectedApply4ll?.gurantee}DAI</p>
            <p className="py-6 text-black">Deposit:{selectedApply4ll?.deposit}DAI</p>
            <p className="py-6 text-white">Leasing Start Time:{selectedApply4ll?.leaseStartTime}</p>
            <p className="py-6 text-white">Leasing End Time:{selectedApply4ll?.leaseEndTime}</p>
            <p>Contract Address: {selectedApply4ll?.contractAddr}</p>
          </div>
        );
        case "minted":
        return (
          <div>
            <p className="text-2xl font-bold font-sans">
              This agreement has been minted.
            </p>
            <p className="py-6 text-black">House Address:{selectedApply4ll?.houseAddress}</p>
            <p className="py-6 text-black">Tenant:{selectedApply4ll?.tenantAddress}</p>
            <p className="py-6 text-black">Rent:{selectedApply4ll?.rent}DAI</p>
            <p className="py-6 text-black">Gurantee:{selectedApply4ll?.gurantee}DAI</p>
            <p className="py-6 text-black">Deposit:{selectedApply4ll?.deposit}DAI</p>
            <p className="py-6 text-white">Leasing Start Time:{selectedApply4ll?.leaseStartTime}</p>
            <p className="py-6 text-white">Leasing End Time:{selectedApply4ll?.leaseEndTime}</p>
            <p>Contract Address: {selectedApply4ll?.contractAddr}</p>
          </div>
        );
      case "outdated":
        return (
          <div>
            <p className="text-2xl font-bold font-sans">This application has been outdated.</p>
            <p className="py-6 text-black">House Address:{selectedApply4ll?.houseAddress}</p>
            <p className="py-6 text-black">Tenant:{selectedApply4ll?.tenantAddress}</p>
            <p className="py-6 text-black">Rent:{selectedApply4ll?.rent}DAI</p>
            <p className="py-6 text-black">Gurantee:{selectedApply4ll?.gurantee}DAI</p>
            <p className="py-6 text-black">Deposit:{selectedApply4ll?.deposit}DAI</p>
            <p className="py-6 text-white">Leasing Start Time:{selectedApply4ll?.leaseStartTime}DAI</p>
            <p className="py-6 text-white">Leasing End Time:{selectedApply4ll?.leaseEndTime}DAI</p>
            <p>Contract Address: {selectedApply4ll?.contractAddr}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const handleEndRental = async () => {
    // Logic for handling end rental action
    await endrent({
      args:[BigInt(0)]
    });
    if(!isEndRentalLoading){
      try {
        const response = await fetch(`/api/applys4ll?id=${selectedApply4ll?.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        if (data) {
          alert("You have ended this rental successfully!");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleMint = async () => {
    // Logic for handling end rental action
    await safeMint();
    if(!isMintLoading){
      //需要重新写个接口来把申请的status设置为minted，然后把按钮置为dissabled
      try {
        const response = await fetch(`/api/applys4ll?id=${selectedApply4ll?.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        if (data) {
          alert("This agreement has been minted!!");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleApply = async () => {
    try {
      // Handling for creating contract
      await createRentalAgreement(); // Create rental agreement first
  
      // Wait for 4 seconds
      await new Promise((resolve) => setTimeout(resolve, 4000));
  
      // Access the rental agreement address
      if (!isRentalCreatedLoading) {
        console.log(newRentalAddr,"this is from handleApply!!")
        const response = await fetch(`/api/applys4ll?id=${selectedApply4ll?.id}&contractAddr=${newRentalAddr}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        const data = await response.json();
        console.log(data);
  
        if (data) {
          alert("You have created the contract successfully!");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleWithdraw = async() => {
    // Logic for handling withdraw unpaid rent
    await withdraw();

    if (!isWithdrawLoading)
    alert("withdraw successfully!");
  };

  return (
    <div className="w-full p-5">
      <h1 className="mb-5 text-6xl font-bold font-sans text-black">Apply Details</h1>
      <div className="mx-auto w-full backdrop-blur-lg backdrop-filter p-10 m-10 rounded-lg opacity-80 shadow-md overflow-auto overflow-y-auto">
        {renderStatusMessage()}
      </div>
    </div>
  );
};

export default ApplyDetail4ll;
