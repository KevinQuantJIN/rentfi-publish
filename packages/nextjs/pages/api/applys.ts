// pages/api/apply.ts
import { APPLY } from "../types";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const filePath = path.join(process.cwd(), "/data/applyData.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const data = fs.readFileSync(filePath).toString();
    const applications: APPLY[] = JSON.parse(data).applications;

    const {houseId,tenantAddress,leaseStartTime,leaseEndTime,houseName,rent,gurantee,houseAddress,landlord,deposit,Pic}=req.query;
    const newApply: APPLY = {
        id: applications.length + 1,
        houseId: parseInt(houseId as string,10), // 直接使用 req.body.houseId 获取值
        tenantAddress: tenantAddress as string,
        leaseStartTime: leaseStartTime as string,
        leaseEndTime: leaseEndTime as string,
        status: "applied",
        houseName: houseName as string as string,
        rent: parseInt(rent as string,10),
        gurantee: parseInt(gurantee as string,10),
        houseAddress: houseAddress as string,
        landlord: landlord as string,
        deposit: parseInt(deposit as string,10),
        Pic: Pic as string,
        contractAddr:""
    };
    // const data1=JSON.stringify(req.body);
    // console.log("this is from applys!",newApply);

    applications.push(newApply);

    fs.writeFileSync(filePath, JSON.stringify({ applications }));

    res.status(201).json(newApply);
  } 
  else if (req.method==="GET"){
    const data = fs.readFileSync(filePath).toString();
    const applications: APPLY[] = JSON.parse(data).applications;

    const { tenantAddress } = req.query;

    // 过滤符合条件的记录
    const filteredApplications = applications.filter(
      (application) => application.tenantAddress === tenantAddress
    );

    res.status(200).json(filteredApplications);
  }else if (req.method==="PUT"){
    const data = fs.readFileSync(filePath).toString();
    const applications: APPLY[] = JSON.parse(data).applications;

    const { id } = req.query;
    // 找到对应的申请记录
    const targetApply = applications.find(apply => apply.id === parseInt(id as string, 10));

    if (targetApply) {
      // 更新申请记录的status
      targetApply.status = "signed";

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
