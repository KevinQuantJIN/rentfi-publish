import React from 'react';

interface NFTItemProps {
  // Pic: string;
  tokenId: string;
  price: number;
}

const NftItems: React.FC<NFTItemProps> = ({ tokenId, price }) => (
  <div className="product-item p-4 rounded-lg border hover:shadow-lg transition-all duration-300 glass">
    <div className="text-sm font-bold mb-1">{tokenId}</div>
    <div className="text-xs text-gray-600">{price}DAI</div>
  </div>
);

export default NftItems;
