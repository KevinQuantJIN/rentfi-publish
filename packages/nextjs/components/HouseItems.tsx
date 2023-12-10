import React from 'react';

interface HOUSEItemProps {
  Pic: string;
  houseName: string;
  rent: number;
}

const HouseItems: React.FC<HOUSEItemProps> = ({ Pic, houseName, rent }) => (
  <div className="product-item p-4 rounded-lg border hover:shadow-lg transition-all duration-300 glass">
    <img src={Pic} alt={houseName} className="w-full h-32 object-cover mb-2 rounded-md" />
    <div className="text-sm font-bold mb-1">{houseName}</div>
    <div className="text-xs text-gray-600">{rent}</div>
  </div>
);

export default HouseItems;
