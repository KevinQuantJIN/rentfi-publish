// pages/api/houses.ts
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { HOUSE } from '../types';

const filePath = path.join(process.cwd(), '/data/houseData.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 获取房屋列表
    const data = fs.readFileSync(filePath).toString();
    const houses:HOUSE[] = JSON.parse(data).houses;
    res.status(200).json(houses);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
