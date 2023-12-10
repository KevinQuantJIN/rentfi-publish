// 创建一个名为UserTypeContext的上下文
import { FC, ReactNode, createContext, useContext, useState } from "react";
import { APPLY } from "~~/pages/types";

interface UserTypeContextProps {
  userType: string;
  selectedApply: APPLY | null;
  selectedApply4ll: APPLY | null;
  setUserType: (type: string) => void;
  setSelectedApply: (apply: APPLY | null) => void;
  setSelectedApply4ll: (apply: APPLY | null) => void;
  getUserType: () => string;
}

export const UserTypeContext = createContext<UserTypeContextProps>({
  userType: "",
  selectedApply: null,
  selectedApply4ll: null,
  setUserType: () => {},
  setSelectedApply: () => {},
  setSelectedApply4ll: () => {},
  getUserType: () => "",
});

// 创建一个名为UserTypeProvider的上下文提供者组件
export const UserTypeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState("");
  const [selectedApply, setSelectedApply] = useState<APPLY | null>(null);
  const defaultValue4ll: APPLY = {
    houseId: 1,
    houseName: "hhhh",
    rent: 100,
    gurantee: 50,
    houseAddress: "hhhhh",
    landlord: "0xE34D138fCEFb90817b3D47C70cc433Ea6d747eBa",
    deposit: 50,
    Pic: "",
    id: 0,
    tenantAddress: "",
    leaseStartTime: "",
    leaseEndTime: "",
    status: "applied",
    contractAddr: "",
  };
  const [selectedApply4ll, setSelectedApply4ll] = useState<APPLY | null>(defaultValue4ll);

  const getUserType = () => {
    return userType;
  };

  return (
    <UserTypeContext.Provider
      value={{
        userType,
        getUserType,
        setUserType,
        selectedApply,
        setSelectedApply,
        selectedApply4ll,
        setSelectedApply4ll,
      }}
    >
      {children}
    </UserTypeContext.Provider>
  );
};

// // 创建一个自定义的useUserType钩子，用于在需要的页面中获取用户选择的身份信息
// export const useUserType = (): UserTypeContextProps => {
//   const context = useContext(UserTypeContext);

//   if (!context) {
//     throw new Error("useUserType必须在UserTypeProvider内使用");
//   }

//   return context;
// };
