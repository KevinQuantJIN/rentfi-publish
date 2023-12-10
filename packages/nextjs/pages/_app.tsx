import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { ConnectButton, RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { useDarkMode } from "usehooks-ts";
import { WagmiConfig } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import RoleSelection from "~~/components/RoleSelection";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { UserTypeContext } from "~~/contexts/useGlobalInfo";
import { UserTypeProvider } from "~~/contexts/useGlobalInfo";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { appChains } from "~~/services/web3/wagmiConnectors";
import "~~/styles/globals.css";

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
  // This variable is required for initial client side rendering of correct theme for RainbowKit
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");
  const { isDarkMode } = useDarkMode();
  const [userType, setUserType] = useState("");

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }
  }, [setNativeCurrencyPrice, price]);

  useEffect(() => {
    setIsDarkTheme(isDarkMode);
  }, [isDarkMode]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };
  return (
    <WagmiConfig config={wagmiConfig}>
      <NextNProgress />
      <RainbowKitProvider
        chains={appChains.chains}
        avatar={BlockieAvatar}
        theme={isDarkTheme ? darkTheme() : lightTheme()}
      >
        {/* <UserTypeContext.Provider value={{ userType, setUserType }}> */}
        <UserTypeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="relative flex flex-col flex-1">
              <Component {...pageProps} />
            </main>
            <Footer />
            <Toaster />
          </div>
        </UserTypeProvider>

        {/* </UserTypeContext.Provider> */}
        {/* <div className="flex flex-col min-h-screen">
          <UserTypeContext.Provider value={{ userType, setUserType }}>
            <Header />
            <main className="relative flex flex-col flex-1">
              <Component {...pageProps} />
            </main>
          </UserTypeContext.Provider>
          <Header selectedRole={selectedRole} />
          {selectedRole ? (
            <main className="relative flex flex-col flex-1">
              <Component {...pageProps} />
            </main>
          ) : (
            // <RoleSelection onRoleSelect={handleRoleSelect} />
            <div className="hero min-h-screen bg-base-200" style={{backgroundImage: 'url(https://cdn.discordapp.com/attachments/1008571118694703204/1180766833909964850/rentfi_Animation_style_the_content_of_the_picture_is_of_a_bustl_a510c078-18bc-4529-920d-3bb3ce67ded1.png?ex=657e9dce&is=656c28ce&hm=c039b5275bd3767e7266eefce87fde5b054ccb352a65b287870eca1c6a6252ed&)'}}>
              <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                  <h1 className="text-5xl font-bold text-white">Login now and choose your identity!</h1>
                  <p className="text-white text-2xl">
                    Welcome to RentFi, a rental platform built on blockchain. 
                  </p>
                  <p className="py-2 text-white text-2xl italic font-bold">
                  Make transactions more transparent and earn more.
                  </p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                <RoleSelection onRoleSelect={handleRoleSelect} />
                </div>
              </div>
            </div>
          )}
          <Footer />
        </div> */}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default ScaffoldEthApp;
