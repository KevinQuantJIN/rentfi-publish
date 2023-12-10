// pages/api/nft/[id].ts
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { NFT } from "~~/pages/types";

const filePath = path.join(process.cwd(), "/data/nftData.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    // 获取指定 ID 的 NFT 详情
    const data = fs.readFileSync(filePath).toString();
    const nfts: NFT[] = JSON.parse(data).nfts;
    const nft = nfts.find(nft => nft.NFTID.toString() === id);
    console.log(nft);

    if (nft) {
      res.status(200).json(nft);
    } else {
      res.status(404).json({ error: "NFT not found" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
