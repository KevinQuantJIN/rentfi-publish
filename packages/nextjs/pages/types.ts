// types.ts
export interface NFT {
  NFTID: number;
  NFTName: string;
  NFTDescription: string;
  ExpectPrice: number;
  Pic: string;
  PublicAddress: string;
  Time: string;
}

export interface HOUSE {
  houseId: number;
  houseName: string;
  rent: number;
  gurantee: number;
  houseAddress: string;
  landlord: string;
  deposit: number;
  Pic: string;
}

export interface APPLY{
  houseId: number;
  houseName: string;
  rent: number;
  gurantee: number;
  houseAddress: string;
  landlord: string;
  deposit: number;
  Pic: string;
  id:number,
  tenantAddress:string,
  leaseStartTime:string,
  leaseEndTime:string
  status:string,
  contractAddr:string
}
