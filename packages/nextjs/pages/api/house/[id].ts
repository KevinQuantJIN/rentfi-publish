// pages/api/nft/[id].ts
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { HOUSE } from "~~/pages/types";

const filePath = path.join(process.cwd(), "/data/houseData.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    // 获取指定 ID 的 NFT 详情
    const data = fs.readFileSync(filePath).toString();
    const houses: HOUSE[] = JSON.parse(data).houses;
    const house = houses.find(h => h.houseId.toString() === id);
    console.log(house);

    if (house) {
      res.status(200).json(house);
    } else {
      res.status(404).json({ error: "NFT not found" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
