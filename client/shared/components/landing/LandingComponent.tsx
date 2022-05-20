import clsx from "clsx";
import React from "react";
import { MainSection } from "./mainSection/mainSection";
import Styles from "./styles.module.scss";

const LandingComponent: React.FunctionComponent<{}> = (props) => {
  return (
    <div className={clsx("flex flex-col items-center", Styles.gradient)}>
      <MainSection />
    </div>
  );
};

export default LandingComponent;
