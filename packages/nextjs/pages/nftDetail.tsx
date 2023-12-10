// ProductDetail.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NFT } from "./types";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface NFTDetailProps {
  id: BigInt;
}

const NFTDetail: React.FC<NFTDetailProps> = id => {
  const router = useRouter();
  const { tokenId } = router.query;
  console.log(tokenId);
  const validTokenId: bigint = BigInt((tokenId as string | undefined) || 0);
  const [nftsInfo, setNFTsInfo] = useState<NFT | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setPageIsLoading] = useState(true);

  //再准备向链上用tokenId来索引信息
  const { data: nftDetails } = useScaffoldContractRead({
    contractName: "RentalCashFlowNFT",
    functionName: "getNFTById",
    args: [validTokenId],
  });

  console.log(nftDetails);
  //链上交易模块
  const { writeAsync: deal, isLoading: isDealloading } = useScaffoldContractWrite({
    contractName: "RentalCashFlowNFT",
    functionName: "executeSale",
    args: [validTokenId],
    value:nftDetails?.initialPrice,
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });
  useEffect(() => {
    setPageIsLoading(false);
  }, []);

  const handleConfirm = async () => {
    setIsLoading(true);

    await deal();

    if(!isDealloading){
      router.push('/marketplace');
    }
  };
  if (!nftDetails) {
    // 加载中的状态，可以显示 loading 动画或其他提示
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10">
      {/* 聊天咨询的modal */}
      <dialog id="chat_model" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Let's chat with the owner!</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      {/* 交易的modal，这里交易就不单独做一个页面了，只是一个modal来确认是否交易，如果用户输入私钥确认交易，则调用交易结果，等待交易确认后，则出现一个toast提示交易已完成，并且页面跳转到市场发现首页 */}
      <dialog id="transaction_model" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              // onClick={onClose}
            >
              ✕
            </button>
          </form>
          <h1 className="text-4xl font-bold">Deal Confirm</h1>
          <p className="py-6">
          Do you want to buy this NFT:{nftDetails.rentalAgreementAddress} for {Number(nftDetails.initialPrice)} DAI?
        </p>

          {/* 确认和取消按钮 */}
          <div className="flex justify-end">
            <button
              className={`btn btn-primary mr-2 ${isLoading ? "cursor-not-allowed" : ""}`}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? "trading..." : "Trade Confirmed"}
            </button>
          </div>
        </div>
      </dialog>
      {isPageLoading ? (
        <div className="product-display w-full mt-40 p-7 mx-auto rounded-lg border glass flex items-center justify-center">
          <span className="loading loading-bars loading-lg"></span>
          <span className="loading loading-bars loading-lg"></span>
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : (
        <div className="card lg:card-side bg-base-100 shadow-xl m-5 p-5">
          <div className="card-body">
            <h1 className="text-5xl font-bold break-all">{nftDetails?.rentalAgreementAddress}</h1>
            <p className="py-6 italic text-sm">{nftDetails?.houseName}</p>
            <p className="py-6 break-all">Holder:{nftDetails?.landlord}</p>
            <h2 className="card-title">Initial Price:{Number(nftDetails?.initialPrice)} DAI</h2>
            <h2 className="card-title">Rent:{Number(nftDetails?.rent)} DAI</h2>
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary"
                onClick={() => {
                  const chatModel = document.getElementById("chat_model") as HTMLDialogElement | null;
                  if (chatModel) {
                    chatModel.showModal();
                  }
                }}
              >
                chat with seller
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const transaction_modal = document.getElementById("transaction_model") as HTMLDialogElement | null;
                  if (transaction_modal) {
                    transaction_modal.showModal();
                  }
                }}
              >
                I WANT IT!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTDetail;
