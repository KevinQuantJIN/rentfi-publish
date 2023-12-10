// ProductDetail.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HOUSE } from "../pages/types";
import { useAccount } from "wagmi";

interface HouseDetailProps {
  id: string;
}

const HOUSEDetail: React.FC<HouseDetailProps> = ({ id }) => {
  const router = useRouter();
  const [houseInfo, setHouseInfo] = useState<HOUSE | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setPageIsLoading] = useState(true);

  //收集租户信息
  const { address } = useAccount();
  const [lsTime, setLsTime] = useState("");
  const [leTime, setLeTime] = useState("");

  useEffect(() => {
    // 根据商品ID向后端请求商品信息
    // 用于从后端获取商品信息
    const fetchHouseInfo = async () => {
      try {
        const response = await fetch(`/api/house/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data) {
          setPageIsLoading(false);
        }
        console.log(data);
        setHouseInfo(data);
      } catch (error) {
        console.error("Error fetching nft information:", error);
      }
    };

    fetchHouseInfo();
  }, [id]);

  const handleConfirm = async () => {
    setIsLoading(true);

    //检查productInfo是否可用
    if (houseInfo) {
      //创建一个formdata来上传数据
      // const applydata = new FormData();

      // //把接口入参添加进formdata里
      // applydata.append("rent", String(houseInfo.rent));
      // applydata.append("houseId", String(houseInfo.houseId));
      // applydata.append("houseName", String(houseInfo.houseName));
      // applydata.append("gurantee", String(houseInfo.gurantee));
      // applydata.append("houseAddress", String(houseInfo.houseAddress));
      // applydata.append("landlord", String(houseInfo.landlord));
      // applydata.append("deposit", String(houseInfo.deposit));
      // applydata.append("Pic", String(houseInfo.Pic));
      // applydata.append("tenantAddress", String(address));
      // applydata.append("leaseStartTime", String(lsTime));
      // applydata.append("leaseEndTime", String(leTime));

      // console.log("this is from houseDetail!",applydata);

      //由于req的body方法无法解析，所以没有选择formdata的方法来传参，而是选择query传参
      const applydata1 = {
        rent: String(houseInfo.rent),
        houseId: String(houseInfo.houseId),
        houseName: String(houseInfo.houseName),
        gurantee: String(houseInfo.gurantee),
        houseAddress: String(houseInfo.houseAddress),
        landlord: String(houseInfo.landlord),
        deposit: String(houseInfo.deposit),
        Pic: String(houseInfo.Pic),
        tenantAddress: String(address),
        leaseStartTime: String(lsTime),
        leaseEndTime: String(leTime),
      };
      const queryString = Object.entries(applydata1)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

      // 在这里调用交易接口，使用 privatekey 参数
      // 交易接口返回 true 表示交易成功
      // console.log(formdata);
      // console.log(productInfo);
      // 遍历FormData对象的键值对并打印
      // for (const pair of applydata.entries()) {
      //   console.log(pair[0] + ": " + pair[1]);
      // }

      const applySuccess = await fetch(`/api/applys?${queryString}`, {
        method: "POST",
      });
      const data = await applySuccess.json();
      // console.log(data);
      // const transactionSuccess=true;

      if (data) {
        // 交易成功后执行一些操作，比如显示提示，跳转页面等
        alert("Application has been submitted");
        const apply_modal = document.getElementById("apply_model") as HTMLDialogElement | null;
        if (apply_modal) {
          apply_modal.close();
        }
        //跳转到marketplace
        router.push("/houserecommend");
      } else {
        // 交易失败时处理
        alert("Pls retry!");
      }

      setIsLoading(false);
    }
  };
  if (!houseInfo) {
    // 加载中的状态，可以显示 loading 动画或其他提示
    return (
      <div className="p-10">
        <span className="loading loading-bars loading-lg"></span>
        <span className="loading loading-bars loading-lg"></span>
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
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
      <dialog id="apply_model" className="modal">
        <div className="modal-box flex-col flex">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              // onClick={onClose}
            >
              ✕
            </button>
          </form>
          <h1 className="text-4xl font-bold">Apply Confirm</h1>
          <p className="py-6 break-all">
            Have you confirmed the price {houseInfo.rent} for leasing {houseInfo.houseName}? To do this, you need to pay
            a gurrantee of {houseInfo.gurantee} first and a deposit of {houseInfo.deposit}.
          </p>

          <p className="py-4 break-all">Pls input your leasing start and end time.</p>
          <input
            type="text"
            placeholder="Input your leasing start time. YY-MM-DD"
            value={lsTime}
            onChange={e => setLsTime(e.target.value)}
            className="input input-bordered mb-4"
          />
          <input
            type="text"
            placeholder="Input your leasing end time. YY-MM-DD"
            value={leTime}
            onChange={e => setLeTime(e.target.value)}
            className="input input-bordered mb-4"
          />

          {/* 确认和取消按钮 */}
          <div className="flex justify-end">
            <button
              className={`btn btn-primary mr-2 ${isLoading ? "cursor-not-allowed" : ""}`}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? "applying..." : "apply confirm!"}
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
          <figure>
            <img src={houseInfo.Pic} alt={houseInfo.houseName} />
          </figure>
          <div className="card-body">
            <h1 className="text-5xl font-bold">{houseInfo.houseName}</h1>
            <p className="py-6 italic text-sm">{houseInfo.houseAddress}</p>
            <p className="py-6 break-all">Landlord:{houseInfo.landlord}</p>
            <h2 className="card-title">Rent:{houseInfo.rent}</h2>
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
                chat with landlord
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const apply_modal = document.getElementById("apply_model") as HTMLDialogElement | null;
                  if (apply_modal) {
                    apply_modal.showModal();
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

export default HOUSEDetail;
