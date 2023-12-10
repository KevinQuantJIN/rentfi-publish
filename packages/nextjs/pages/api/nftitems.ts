// pages/api/nftitems.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { NFT } from '../types';

const filePath = path.join(process.cwd(), '/data/nftData.json');

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
  } else if (req.method === 'SEARCH' && req.query.publicAddress) {
    // 根据 publicAddress 查询匹配的 NFT
    const publicAddress: string = req.query.publicAddress as string;
    const data = fs.readFileSync(filePath).toString();
    const nfts: NFT[] = JSON.parse(data).nfts;
    const matchingNFTs = nfts.filter((nft) => nft.PublicAddress === publicAddress);
    res.status(200).json(matchingNFTs);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
