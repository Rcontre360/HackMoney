import React from "react";
import Link from "next/link";
import clsx from "clsx";
import Navbar from '../components/navbar';

interface Props {}

const Layout: React.FunctionComponent<Props> = ({children}) => {
  return (
    <>
      <Navbar />
      <div style={{ scrollBehavior: "smooth" }}>{children}</div>
    </>
  );
};

export default Layout;
