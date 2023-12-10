import React, { useEffect, useState } from "react";
import { useContext } from "react";
import Link from "next/link";
import { APPLY } from "../../pages/types";
import { useAccount } from "wagmi";
import { UserTypeContext } from "~~/contexts/useGlobalInfo";

const ApplyList = () => {
  const [applies, setApplies] = useState<APPLY[]>([]);
  const { address, isConnecting, isDisconnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const { setSelectedApply } = useContext(UserTypeContext);

  const handleApplyClick = (s: APPLY) => {
    setSelectedApply(s);
  };
  const handleSearch = async () => {
    // console.log(address);
    try {
      const response = await fetch(`/api/applys?tenantAddress=${address}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      if (data) {
        setIsLoading(false);
      }
      console.log(data);
      setApplies(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleSearch();
  });
  return (
    <div className="w-full p-5">
      <h1 className="mb-5 text-6xl font-bold font-sans text-white">Apply Record List</h1>
      <div
        className="mx-auto rounded-lg border glass flex-col p-5"
        style={{ maxWidth: "100%" }}
      >
        {isLoading ? (
          <div className="product-display w-full mt-40 p-7 mx-auto rounded-lg border glass flex items-center justify-center">
            <span className="loading loading-bars loading-lg"></span>
            <span className="loading loading-bars loading-lg"></span>
            <span className="loading loading-bars loading-lg"></span>
          </div>
        ) : (
          applies.map((s, index) => (
            <div
              className="card bg-orange-300 shadow-xl text-black m-5 glass"
              key={index}
              onClick={() => handleApplyClick(s)}
            >
              <div className="card-body">
                <div className="tooltip tooltip-open tooltip-right" data-tip={`STATUS:` + s.status}>
                  <h2 className="card-title text-left">{s.houseName}</h2>
                  <p className="card-title text-left text-xl">Holder:</p>
                  <p className="text-left break-all">{s.landlord}</p>
                </div>
                <p className="m-5 text-left break-all">rent:{s.rent}DAI</p>
                <p className="text-left">
                  Leasing Time: from {s.leaseStartTime} to {s.leaseEndTime}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplyList;
