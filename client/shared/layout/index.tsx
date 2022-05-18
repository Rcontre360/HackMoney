import React from "react";
import Link from "next/link";
import clsx from "clsx";

interface Props {}

const Layout: React.FunctionComponent<Props> = ({children}) => {
  return (
    <>
      <nav
        className={clsx(
          "sticky top-0 flex items-center justify-between z-50 w-full shadow-lg p-4",
          "transition duration-500 ease-in-out bg-white"
        )}
      >
        <div className="text-primary f-24 font-black">
          <Link href="/">ChainScore</Link>
        </div>
        <div className="flex">
          <div className="text-sm flex">
            {/* <div className="mr-6">
              <Link href="/">Link</Link>
            </div> */}
          </div>
        </div>
      </nav>
      <div style={{ scrollBehavior: "smooth" }}>{children}</div>
    </>
  );
};

export default Layout;
