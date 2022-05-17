import React from "react";
import Link from "next/link";
import clsx from "clsx";

interface Props {}

const Layout: React.FunctionComponent<Props> = ({children}) => {
  return (
    <>
      <nav
        className={clsx(
          "fixed top-0 z-10 flex items-center justify-between z-50 w-full shadow-lg p-4",
          "transition duration-500 ease-in-out"
        )}
      >
        <div className="w-full block flex">
          <div className="text-sm lg:flex-grow flex">
            <div className="mr-6">
              <Link href="/">Link</Link>
            </div>
            <div className="mr-6">
              <Link href="/">Link</Link>
            </div>
            <div className="mr-6">
              <Link href="/">Link</Link>
            </div>
            <div className="mr-6">
              <Link href="/">Link</Link>
            </div>
          </div>
        </div>
      </nav>
      <div style={{scrollBehavior: "smooth"}}>{children}</div>
    </>
  );
};

export default Layout;
