// pages/api/apply.ts
import { APPLY } from "../types";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const filePath = path.join(process.cwd(), "/data/applyData.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    //这个post方法后续要改成写入创建合约的地址，以及把申请记录的status修改为created
    const data = fs.readFileSync(filePath).toString();
    const applications: APPLY[] = JSON.parse(data).applications;

    const { id, contractAddr } = req.query;
    // 找到对应的申请记录
    const targetApply = applications.find(apply => apply.id === parseInt(id as string, 10));

    if (targetApply) {
      // 更新申请记录的 contractAddr 和 status
      targetApply.contractAddr = contractAddr as string;
      targetApply.status = "created";

      // 写回文件
      fs.writeFileSync(filePath, JSON.stringify({ applications }));

      res.status(200).json(targetApply);
    } else {
      res.status(404).json({ error: "Application not found" });
    }
  } else if (req.method === "GET") {
    const data = fs.readFileSync(filePath).toString();
    const applications: APPLY[] = JSON.parse(data).applications;

    const { landlord } = req.query;

    // 过滤符合条件的记录
    const filteredApplications = applications.filter(application => application.landlord === landlord);

    res.status(200).json(filteredApplications);
  } 
  else if (req.method==="DELETE"){
    const data = fs.readFileSync(filePath).toString();
    const applications: APPLY[] = JSON.parse(data).applications;

    const { id } = req.query;
    // 找到对应的申请记录
    const targetApply = applications.find(apply => apply.id === parseInt(id as string, 10));

    if (targetApply) {
      // 更新申请记录的status
      targetApply.status = "outdated";

      // 写回文件
      fs.writeFileSync(filePath, JSON.stringify({ applications }));

      res.status(200).json(targetApply);
    } else {
      res.status(404).json({ error: "Application not found" });
    }
  }else if (req.method==="PATCH"){
    const data = fs.readFileSync(filePath).toString();
    const applications: APPLY[] = JSON.parse(data).applications;

    const { id } = req.query;
    // 找到对应的申请记录
    const targetApply = applications.find(apply => apply.id === parseInt(id as string, 10));

    if (targetApply) {
      // 更新申请记录的status
      targetApply.status = "minted";

      // 写回文件
      fs.writeFileSync(filePath, JSON.stringify({ applications }));

      res.status(200).json(targetApply);
    } else {
      res.status(404).json({ error: "Application not found" });
    }
  }
  else {
    res.status(405).end(); // Method Not Allowed
  }
}
