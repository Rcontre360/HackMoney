import React from "react";
import Link from "next/link";
import clsx from "clsx";

interface Props {}

const LayoutLanding: React.FunctionComponent<Props> = ({ children }) => {
  return (
    <>
      <nav
        className={clsx(
          "fixed top-0 flex items-center justify-between z-50 w-full shadow-lg p-4",
          "transition duration-500 ease-in-out bg-color2 h-16"
        )}
      >
        <div className="text-color1 f-24 font-black">
          <Link href="/">
            <div className="flex text-color1 gap-4">
              <img src={"/icons/logo.png"} className="h-8 w-8" alt="" />
              ChainScore
            </div>
          </Link>
        </div>
        <div className="flex">
          <div className="text-sm flex">
            <div className="mr-6 bg-color1 text-white px-4 py-2 rounded-md">
              <Link href="/app">Earn with us</Link>
            </div>
          </div>
        </div>
      </nav>
      <div style={{ scrollBehavior: "smooth" }} className="layout">
        {children}
      </div>
    </>
  );
};

export default LayoutLanding;
