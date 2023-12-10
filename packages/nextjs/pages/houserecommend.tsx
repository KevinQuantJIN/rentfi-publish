import { useEffect, useState } from "react";
import Link from "next/link";
import { HOUSE } from "./types";
import HouseItems from "~~/components/HouseItems";

const Houserecommend = () => {
  const [searchTerm, setSearchTerm] = useState(""); //搜索栏的输入
  const [houses, setHouses] = useState<HOUSE[]>([]); //nft列表
  const [isLoading, setIsLoading] = useState(true);
  //把用户输入的需求发送给后端，并获取返回的商品列表
  const handleSearch = async () => {
    try {
      const response = await fetch("/api/houses", {
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
      setHouses(data);
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
        backgroundImage: 'url("https://cdn.midjourney.com/39394b07-8891-4e21-b4cb-501427f987d7/0_0.webp")',
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
          <span className="font-bold text-5xl">House Recommendation</span>
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
            {houses.map((n, index) => (
              <Link
                key={index}
                href={{
                  pathname: "/[id]",
                  query: { id: n.houseId, type: "house" },
                }}
                as={`/${n.houseId}`}
              >
                <HouseItems key={index} {...n} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Houserecommend;
