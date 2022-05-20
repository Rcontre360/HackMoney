import LandingComponent from "@shared/components/landing/LandingComponent";
import LayoutLanding from "@shared/layout/layoutLanding";
import React from "react";

const App: React.FunctionComponent<{}> = (props) => {
  return (
    <LayoutLanding>
      <LandingComponent />
    </LayoutLanding>
  );
};

export default App;
