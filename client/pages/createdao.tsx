import Borrow from "@shared/components/borrow";
import LayoutLanding from "@shared/layout/layoutLanding";
import React from "react";

const CreateDao: React.FunctionComponent<{}> = (props) => {
  return (
    <LayoutLanding>
      <div className="flex flex-col items-center bg-color2">
        <Borrow />
      </div>
    </LayoutLanding>
  );
};

export default CreateDao;
