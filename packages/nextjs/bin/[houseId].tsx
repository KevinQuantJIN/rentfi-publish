// pages/[houseId].tsx

import { useRouter } from "next/router";
import HOUSEDetail from "~~/components/houseDetail";

const HousePage = () => {
  const router = useRouter();
  const { houseId } = router.query;
  // console.log(nftid);

  if (!houseId) {
    // 可以显示加载中的状态或其他错误提示
    return (
      <div className="product-display w-full mt-40 p-7 mx-auto rounded-lg border glass flex items-center justify-center">
        <span className="loading loading-bars loading-lg"></span>
        <span className="loading loading-bars loading-lg"></span>
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return <HOUSEDetail id={houseId as string} />;
};

export default HousePage;
