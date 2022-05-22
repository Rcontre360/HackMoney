import clsx from "clsx";
import React from "react";
import { About, About1 } from "./about/about";
import { Contactus } from "./contactus";
import { MainSection } from "./mainSection/mainSection";
import { Stats } from "./stats/stats";
import Styles from "./styles.module.scss";

const LandingComponent: React.FunctionComponent<{}> = (props) => {
  return (
    <div
      className={clsx("flex flex-col items-center bg-color2", Styles.gradient)}
    >
      <MainSection />
      <About />
      <About1 />
      <Stats />
      <Contactus />
    </div>
  );
};

export default LandingComponent;
