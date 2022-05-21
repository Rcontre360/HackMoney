import * as React from "react";
import { Button } from "@shared/components/common/button/button";
import Styles from "./styles.module.scss";
import clsx from "clsx";

export const About: React.FC = () => {
  return (
    <div
      className={clsx(
        "w-full flex relative h-full bg-white pt-20 items-center justify-center 2xl:px-32 xl:px-28 sm:px-10 gap-10"
      )}
    >
      <div className="md:w-1/2 flex items-center justify-center">
        <img src="/icons/main.png" className="w-2/3" alt="" />
      </div>
      <div className="md:w-1/2">
        <h1
          className={clsx(
            "f-58 lh-80 font-extrabold text-white pb-5 text-secondary Lato"
          )}
        >
          About Us
        </h1>
        <p className={clsx("f-24 font-thin text-secondary text-white")}>
          ChainScore is a protocol for uncollateralized lending, powered by an
          <span className="text-primary"> on-chain credit score</span>
        </p>
      </div>
    </div>
  );
};

export const About1: React.FC = () => {
  return (
    <div
      className={clsx(
        "w-full flex relative h-full bg-white pt-20 items-center justify-center 2xl:px-32 xl:px-28 sm:px-10 gap-10"
      )}
    >
      <div className="md:w-1/2 flex items-center justify-center">
        <img src="/icons/main.png" className="w-2/3" alt="" />
      </div>
      <div className="md:w-1/2">
        <h1
          className={clsx(
            "f-58 lh-80 font-extrabold text-white pb-5 text-secondary Lato"
          )}
        >
          About Us
        </h1>
        <p className={clsx("f-24 font-thin text-secondary text-white")}>
          ChainScore is a protocol for uncollateralized lending, powered by an
          <span className="text-primary"> on-chain credit score</span>
        </p>
      </div>
    </div>
  );
};

export const About2: React.FC = () => {
  return (
    <div
      className={clsx(
        "w-full flex relative h-full bg-white py-20 items-center justify-center 2xl:px-32 xl:px-28 sm:px-10 gap-10"
      )}
    >
      <div className="md:w-1/2 flex items-center justify-center">
        <img src="/icons/main.png" className="w-2/3" alt="" />
      </div>
      <div className="md:w-1/2">
        <h1
          className={clsx(
            "f-58 lh-80 font-extrabold text-white pb-5 text-secondary Lato"
          )}
        >
          About Us
        </h1>
        <p className={clsx("f-24 font-thin text-secondary text-white")}>
          ChainScore is a protocol for uncollateralized lending, powered by an
          <span className="text-primary"> on-chain credit score</span>
        </p>
      </div>
    </div>
  );
};