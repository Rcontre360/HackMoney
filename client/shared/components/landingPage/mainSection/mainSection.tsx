import * as React from "react";
import { Button } from "@shared/components/common/button/button";
import Styles from "./styles.module.scss";
import clsx from "clsx";

export const MainSection: React.FC = () => {
  return (
    <div
      className={clsx(
        "w-full flex relative h-full min-h-screen pt-20 items-center justify-center 2xl:px-32 xl:px-28 sm:px-10 gap-10"
      )}
    >
      <div className="md:w-1/2">
        <h1
          className={clsx(
            "f-58 lh-80 font-extrabold text-white pb-5 text-color1 Lato"
          )}
        >
          Make The Best With Your <span className="text-color1">Crypto</span>{" "}
          and Get <span className="text-color1">Credited</span> for it
        </h1>
        <p className={clsx("f-24 font-thin text-white")}>
          Get your on-chain score and get truely trustworthy uncollateralized
          loans for <span className="text-color1">DAOs</span>
        </p>
        <div className={clsx("container-button w-full text-left mt-6")}>
          <Button
            href="/app"
            className={clsx("font-bold w-min whitespace-nowrap w-full")}
          >
            Earn with us
          </Button>
        </div>
      </div>
      <div className="md:w-1/2 flex items-center justify-center">
        <img src="/icons/logo.png" className="w-1/2" alt="" />
      </div>
    </div>
  );
};
