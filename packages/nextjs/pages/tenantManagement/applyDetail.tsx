import React from "react";
import { useContext } from "react";
import { APPLY } from "../types";
import { UserTypeContext } from "~~/contexts/useGlobalInfo";
import { useContractWrite } from "wagmi";
import DAI_abi from "../../../const/DAI_abi";
import deployedContracts from "~~/contracts/deployedContracts";

const ApplyDetail = () => {
  const { selectedApply } = useContext(UserTypeContext);
  const status = selectedApply?.status;

  //调用DAI合约中的approve方法来让tenant授权rental agreement合约可以挪动它账户里的钱
  const {data,isLoading,isSuccess,writeAsync}=useContractWrite({
    address:'0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357',
    abi:DAI_abi,
    functionName:'approve',
  })

  //调用agreement的方法来payrent
  const {isLoading:isPayRentLoading,writeAsync:payrent}=useContractWrite({
    address:selectedApply?.contractAddr,
    abi:deployedContracts['11155111'].RentalAgreement.abi,
    functionName:'payRent',
  })

  const renderStatusMessage = () => {
    switch (status) {
      case "applied":
        return (
          <div>
            <p className="text-2xl font-bold font-sans">Waiting for landlord confirmation.</p>
            <p className="py-6 text-black">House Name:{selectedApply?.houseName}</p>
            <p className="py-6 text-black">House Address:{selectedApply?.houseAddress}</p>
            <p className="py-6 text-black">Landlord:{selectedApply?.landlord}</p>
            <p className="py-6 text-black">Rent:{selectedApply?.rent}DAI</p>
            <p className="py-6 text-black">Gurantee:{selectedApply?.gurantee}DAI</p>
            <p className="py-6 text-black">Deposit:{selectedApply?.deposit}DAI</p>
            <p className="py-6 text-white">Leasing Start Time:{selectedApply?.leaseStartTime}DAI</p>
            <p className="py-6 text-white">Leasing End Time:{selectedApply?.leaseEndTime}DAI</p>
          </div>
        );

      case "created":
        return (
          <div>
            <button className="btn btn-success"onClick={handleApprove}>Approve</button>
            <p className="text-2xl font-bold font-sans">Landlord has created a contract. Please review details:</p>
            <p className="py-6 text-black">House Name:{selectedApply?.houseName}</p>
            <p className="py-6 text-black">House Address:{selectedApply?.houseAddress}</p>
            <p className="py-6 text-black">Landlord:{selectedApply?.landlord}</p>
            <p className="py-6 text-black">Rent:{selectedApply?.rent}DAI</p>
            <p className="py-6 text-black">Gurantee:{selectedApply?.gurantee}DAI</p>
            <p className="py-6 text-black">Deposit:{selectedApply?.deposit}DAI</p>
            <p className="py-6 text-white">Leasing Start Time:{selectedApply?.leaseStartTime}DAI</p>
            <p className="py-6 text-white">Leasing End Time:{selectedApply?.leaseEndTime}DAI</p>
            <p>Contract Address: {selectedApply?.contractAddr}</p>
          </div>
        );
      case "signed":
        return (
          <div>
            <button className="btn btn-success" onClick={handlePayRent}>
              Pay Rent
            </button>
            <p className="text-2xl font-bold font-sans">You have a signed contract for {selectedApply?.houseName}.</p>
            <p className="py-6 text-black">House Address:{selectedApply?.houseAddress}</p>
            <p className="py-6 text-black">Landlord:{selectedApply?.landlord}</p>
            <p className="py-6 text-black">Rent:{selectedApply?.rent}DAI</p>
            <p className="py-6 text-black">Gurantee:{selectedApply?.gurantee}DAI</p>
            <p className="py-6 text-black">Deposit:{selectedApply?.deposit}DAI</p>
            <p className="py-6 text-white">Leasing Start Time:{selectedApply?.leaseStartTime}DAI</p>
            <p className="py-6 text-white">Leasing End Time:{selectedApply?.leaseEndTime}DAI</p>
            <p className="py-6 text-white">Contract Address: {selectedApply?.contractAddr}</p>
          </div>
        );
      case "outdated":
        return (
          <div>
            <p className="text-2xl font-bold font-sans">This application has been outdated.</p>
            <p className="py-6 text-black">House Address:{selectedApply?.houseAddress}</p>
            <p className="py-6 text-black">Landlord:{selectedApply?.landlord}</p>
            <p className="py-6 text-black">Rent:{selectedApply?.rent}DAI</p>
            <p className="py-6 text-black">Gurantee:{selectedApply?.gurantee}DAI</p>
            <p className="py-6 text-black">Deposit:{selectedApply?.deposit}DAI</p>
            <p className="py-6 text-white">Leasing Start Time:{selectedApply?.leaseStartTime}DAI</p>
            <p className="py-6 text-white">Leasing End Time:{selectedApply?.leaseEndTime}DAI</p>
            <p>Contract Address: {selectedApply?.contractAddr}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const handleApprove = async() => {
    // Logic for handling approve action
    await writeAsync({
      args:[selectedApply?.contractAddr,100*selectedApply!.rent],
    })
    if(!isLoading){
      try {
        const response = await fetch(`/api/applys?id=${selectedApply?.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        if (data) {
          alert("You have signed this rental contract successfully!");
        }
      } catch (error) {
        console.error(error);
      }
    }
    
  };

  const handlePayRent = async () => {
    // Logic for handling pay rent action

    await payrent();
    if(!isPayRentLoading)
    alert("You have paid this month's rent!");
  };

  return (
    <div className="w-full p-5">
      <h1 className="mb-5 text-6xl font-bold font-sans text-white">Apply Details</h1>
      <div className="mx-auto w-full backdrop-blur-lg backdrop-filter p-10 m-10 rounded-lg opacity-80 shadow-md overflow-auto overflow-y-auto">
        {renderStatusMessage()}
      </div>
    </div>
  );
};

export default ApplyDetail;
