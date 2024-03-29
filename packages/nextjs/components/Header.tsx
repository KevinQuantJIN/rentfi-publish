import React, { useCallback, useRef, useState } from "react";
import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Bars3Icon,
  BugAntIcon,
  CubeTransparentIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { UserTypeContext } from "~~/contexts/useGlobalInfo";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const router = useRouter();
  const isActive = router.asPath === href;
  // console.log(router.pathname);

  return (
    <Link
      href={href}
      passHref
      className={`${
        isActive ? "bg-secondary shadow-md" : ""
      } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
    >
      {children}
    </Link>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );
  const { getUserType } = useContext(UserTypeContext);

  //使用props.selectedRole来获取用户选择的身份
  const getNavLinks = (role: string | null) => {
    console.log(role, "\n this is from Header!!!");
    if (!role) {
      return (
        <>
          <li>
            <NavLink href="/">
              <CubeTransparentIcon className="h-4 w-4" />
              Home
            </NavLink>
          </li>
        </>
      );
    } else if (role === "tenant") {
      return (
        <>
          <li>
            <NavLink href="/houserecommend">
              <CubeTransparentIcon className="h-4 w-4" />
              House recommendations
            </NavLink>
          </li>
          <li>
            <NavLink href="/debug">
              <BugAntIcon className="h-4 w-4" />
              Debug Contracts
            </NavLink>
          </li>
          <li>
            <NavLink href="/marketplace">
              <CurrencyDollarIcon className="h-4 w-4" />
              Marketplace
            </NavLink>
          </li>
          <li>
            <NavLink href="/tenantManagement">
              <MagnifyingGlassIcon className="h-4 w-4" />
              Management
            </NavLink>
          </li>
          <li>
            <NavLink href="/personalInfo">
              <MagnifyingGlassIcon className="h-4 w-4" />
              PersonalInfo
            </NavLink>
          </li>
        </>
      );
    } else if (role === "landlord") {
      return (
        <>
          <li>
            <NavLink href="/landlordManagement">
              <SparklesIcon className="h-4 w-4" />
              Management
            </NavLink>
          </li>
          <li>
            <NavLink href="/debug">
              <BugAntIcon className="h-4 w-4" />
              Debug Contracts
            </NavLink>
          </li>
          <li>
            <NavLink href="/marketplace">
              <CurrencyDollarIcon className="h-4 w-4" />
              Marketplace
            </NavLink>
          </li>
          <li>
            <NavLink href="/personalInfo">
              <MagnifyingGlassIcon className="h-4 w-4" />
              PersonalInfo
            </NavLink>
          </li>
        </>
      );
    } else if (role === "investor") {
      return (
        <>
          <li>
            <NavLink href="/marketplace">
              <CurrencyDollarIcon className="h-4 w-4" />
              Marketplace
            </NavLink>
          </li>
          <li>
            <NavLink href="/debug">
              <BugAntIcon className="h-4 w-4" />
              Debug Contracts
            </NavLink>
          </li>
          <li>
            <NavLink href="/personalInfo">
              <SparklesIcon className="h-4 w-4" />
              PersonalInfo
            </NavLink>
          </li>
        </>
      );
    }
  };

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              {getNavLinks(getUserType())}
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">RentiFi</span>
            <span className="text-xs">Rent plus Finance</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">{getNavLinks(getUserType())}</ul>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
