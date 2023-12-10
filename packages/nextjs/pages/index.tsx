import { useState } from "react";
import { useContext } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import RoleSelection from "~~/components/RoleSelection";
import { UserTypeContext } from "~~/contexts/useGlobalInfo";

const Home: NextPage = () => {
  const { setUserType } = useContext(UserTypeContext);
  const router = useRouter();
  const handleRoleSelect = (event: React.MouseEvent<HTMLButtonElement>, role: string) => {
    event.preventDefault();

    if (role) {
      // console.log(userType, "\n this is from roleselection component1!!!");
      setUserType(role);
      // console.log(userType, "\n this is from roleselection component2!!!");
      if (role === "tenant") {
        router.push("/houserecommend");
      } else if (role === "landlord") {
        router.push("/landlordManagement");
      } else if (role === "investor") {
        router.push("/marketplace");
      }
    }
  };
  return (
    <>
      <div
        className="hero min-h-screen bg-base-200"
        style={{
          backgroundImage:
            "url(https://cdn.discordapp.com/attachments/1008571118694703204/1180766833909964850/rentfi_Animation_style_the_content_of_the_picture_is_of_a_bustl_a510c078-18bc-4529-920d-3bb3ce67ded1.png?ex=657e9dce&is=656c28ce&hm=c039b5275bd3767e7266eefce87fde5b054ccb352a65b287870eca1c6a6252ed&)",
        }}
      >
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-white">Login now and choose your identity!</h1>
            <p className="text-white text-2xl">Welcome to RentFi, a rental platform built on blockchain.</p>
            <p className="py-2 text-white text-2xl italic font-bold">
              Make transactions more transparent and earn more.
            </p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body">
              <h2 className="text-center lg:text-left text-2xl font-bold text-3xl">Who Are You?</h2>
              <div className="form-control">
                <div className="form-control mt-6">
                  <button className="btn btn-primary" onClick={event => handleRoleSelect(event, "tenant")}>
                    Tenant
                  </button>
                </div>
              </div>
              <div className="form-control mt-6">
                <div className="form-control mt-6">
                  <button className="btn btn-primary" onClick={event => handleRoleSelect(event, "landlord")}>
                    Landlord
                  </button>
                </div>
              </div>
              <div className="form-control mt-6">
                <div className="form-control mt-6">
                  <button className="btn btn-primary" onClick={event => handleRoleSelect(event, "investor")}>
                    Investor
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
