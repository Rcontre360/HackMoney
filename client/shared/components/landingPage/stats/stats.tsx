import * as React from "react";
import clsx from "clsx";

export const Stats: React.FC = () => {
  return (
    <div
      className={clsx(
        "w-full flex md:flex-row flex-col relative h-full bg-color1 py-20 items-center justify-center 2xl:px-32 xl:px-28 sm:px-10 gap-10"
      )}
    >
      <div className="md:w-1/2 flex flex-col items-center justify-center">
        <p className={clsx("f-52 font-thin text-color2 text-white")}>
          $ 150,156,150
          <span className="text-white"> USD</span>
        </p>
        <p className={clsx("f-24 font-thin text-color2 text-white")}>
          Total Value Locked
        </p>
      </div>
      <div className="md:w-1/2  flex flex-col items-center justify-center">
        <p className={clsx("f-52 font-thin text-color2 text-white")}>
          $ 150,156,150
          <span className="text-white"> USD</span>
        </p>
        <p className={clsx("f-24 font-thin text-color2 text-white")}>
          Total Interest Earned
        </p>
      </div>
    </div>
  );
};
