import React, { useState, useEffect } from "react";
import Link from "next/link";
import {NFT} from "../pages/types";
import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import router from "next/router";

const PersonalInfo = () => {
    const [NFTs, setNFTs] = useState<NFT[]>([]);
    const {address,isConnecting,isDisconnected}=useAccount();
    const [isLoading, setIsLoading] = useState(true);

    //index nft by address
  const {data:nft}=useScaffoldContractRead({
    contractName:"RentalCashFlowNFT",
    functionName:"getAllNFTs",
  })
  console.log(nft,"this is from chain");
    const handleSearch = async () => {
        console.log(address);
      try {
        const response = await fetch(`/api/nftitems?publicAddress=${address}`, {
          method: "SEARCH",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        // console.log(data);
        if (data) {
          setIsLoading(false);
        }
        console.log(data);
        setNFTs(data);
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      handleSearch();
    }, [address]);
    return (
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://cdn.midjourney.com/de4c8440-4adf-4b4d-b65d-d7659ac90174/0_0.webp)",
        }}
      >
        <div className="hero-overlay bg-opacity-0"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="w-full p-5">
            <h1 className="mb-5 text-6xl font-bold font-sans text-black">
              Personal Infomation 
            </h1>
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
                nft?.map((s, index) => (
                  <div key={index} onClick={() => {
                    // 使用router.push跳转到nftDetail页面，并传递tokenId参数
                    router.push({
                      pathname: "/nftDetail",
                      query: { tokenId: s.tokenId.toString() },
                    });
                  }}>
                    <div className="card bg-orange-300 shadow-xl text-black m-5 glass">
                      <div className="card-body">
                        <div
                          className="tooltip tooltip-open tooltip-right"
                          data-tip={`NFTid:` + Number(s.tokenId)}
                        >
                          <h2 className="card-title text-left">{s.rentalAgreementAddress}</h2>
                          <p className="card-title text-left text-xl">Holder:</p>
                          <p className="text-left break-all">{s.owner}</p>
                        </div>
                        <p className="text-3xl m-5 text-left break-all">
                          {Number(s.price)} DAI
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

export default PersonalInfo;
