// pages/api/nfts.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import {APPLY, NFT} from'../types';

const filePath = path.join(process.cwd(), '/data/nftData.json');
const filePath1 = path.join(process.cwd(), '/data/applyData.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 获取 NFT 列表
    const data = fs.readFileSync(filePath).toString();
    const nfts: NFT[] = JSON.parse(data).nfts;
    res.status(200).json(nfts);
  } else if (req.method === 'POST') {
    // 添加新 NFT
    const newNFT: NFT = req.body;
    const data = fs.readFileSync(filePath).toString();
    const nfts: NFT[] = JSON.parse(data).nfts;
    newNFT.NFTID = nfts.length + 1;
    nfts.push(newNFT);
    fs.writeFileSync(filePath, JSON.stringify({ nfts }));
    res.status(201).json(newNFT);
  } else if (req.method === 'SEARCH') {
    const data = fs.readFileSync(filePath1).toString();
    const applications: APPLY[] = JSON.parse(data).applications;

    const { rentalAddr } = req.query;

    // 过滤符合条件的记录
    const filteredApplications = applications.filter(application => application.contractAddr === rentalAddr);

    res.status(200).json(filteredApplications);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
