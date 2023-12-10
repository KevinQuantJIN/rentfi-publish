// pages/details/[id].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HOUSEDetail from "~~/components/houseDetail";
import NFTDetail from "~~/pages/nftDetail";

const DetailPage = () => {
  const router = useRouter();
  const { id, type } = router.query;

  const isNFT = type === "nft";
  const DetailComponent = isNFT ? NFTDetail : HOUSEDetail;

  if (!id) {
    // 可以显示加载中的状态或其他错误提示
    return (
      <div className="product-display w-full mt-40 p-7 mx-auto rounded-lg border glass flex items-center justify-center">
        <span className="loading loading-bars loading-lg"></span>
        <span className="loading loading-bars loading-lg"></span>
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return <HOUSEDetail id={id as string} />;
};

export default DetailPage;
