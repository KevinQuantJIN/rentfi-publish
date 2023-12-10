// pages/[nftid].tsx

import { useRouter } from "next/router";
import NFTDetail from "~~/pages/nftDetail";

const NFTPage = () => {
  const router = useRouter();
  const { nftid } = router.query;
  // console.log(nftid);

  if (!nftid) {
    // 可以显示加载中的状态或其他错误提示
    return (
      <div className="product-display w-full mt-40 p-7 mx-auto rounded-lg border glass flex items-center justify-center">
        <span className="loading loading-bars loading-lg"></span>
        <span className="loading loading-bars loading-lg"></span>
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return <NFTDetail id={nftid as string} />;
};

export default NFTPage;
