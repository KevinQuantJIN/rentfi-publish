import { useEffect, useState } from "react";
import Link from "next/link";
import { NFT } from "./types";
import NftItems from "~~/components/nftItems";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import router from "next/router";

const marketplace = () => {
  const [searchTerm, setSearchTerm] = useState(""); //搜索栏的输入
  const [nfts, setNFTs] = useState<NFT[]>([]); //nft列表
  const [isLoading, setIsLoading] = useState(true);

  //走合约获取目前上架的nft
  const {data:nft}=useScaffoldContractRead({
    contractName:"RentalCashFlowNFT",
    functionName:"getAllNFTs",
  })
  console.log(nft);
  //把用户输入的需求发送给后端，并获取返回的商品列表
  const handleSearch = async () => {
    try {
      const response = await fetch("/api/nfts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      // if (data) {
      //   setIsLoading(true);
      // }
      // console.log(data);
      setNFTs(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: 'url("https://cdn.midjourney.com/5295203c-1984-4a42-b842-8c9029b0a761/0_3.webp")',
      }}
    >
      {/* 搜索框 */}
      <div className="join absolute top-7">
        <input
          className="input input-bordered join-item w-full"
          placeholder="Input your contract's name"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
          }}
        />
        <button className="btn join-item rounded-r-full" onClick={handleSearch}>
          Search
        </button>
      </div>
      {/* 分割线 */}
      <div className="flex flex-col w-full absolute top-20">
        <div className="divider divider-neutral">
          <span className="font-bold text-5xl">Contract NFTs Marketplace</span>
        </div>
      </div>
      {/* 商品展示栏 */}
      {isLoading ? (
        <div
          className="product-display w-full mt-40 p-7 mx-auto rounded-lg border glass flex items-center justify-center"
          style={{ maxWidth: "80%" }}
        >
          <span className="loading loading-bars loading-lg"></span>
          <span className="loading loading-bars loading-lg"></span>
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : (
        <div
          className="product-display w-full mt-40 mb-20 p-7 mx-auto rounded-lg border glass"
          style={{ maxWidth: "80%" }}
        >
          <div className="grid grid-cols-4 gap-6">
            {nft?.map((n, index) => (
              <div
              key={index}
              onClick={() => {
                // 使用router.push跳转到nftDetail页面，并传递tokenId参数
                router.push({
                  pathname: "/nftDetail",
                  query: { tokenId: n.tokenId.toString() },
                });
              }}
              className="cursor-pointer"
            >
              <NftItems key={index} tokenId={String(n.tokenId)} price={Number(n.price)} />
            </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default marketplace;
