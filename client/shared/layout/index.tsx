import React from "react";
import Link from "next/link";
import clsx from "clsx";
import Navbar from "../components/navbar";
import Styles from "./styles.module.scss";

interface Props {}

const Layout: React.FunctionComponent<Props> = ({ children }) => {
  return (
    <div className={clsx(Styles.containerAll, "bg-color2")}>
      <Navbar />
      <div style={{ scrollBehavior: "smooth" }}>{children}</div>
    </div>
  );
};

export default Layout;
