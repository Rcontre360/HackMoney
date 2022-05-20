import AppComponent from "@shared/components/app/AppComponent";
import Layout from "@shared/layout";
import React from "react";

const App: React.FunctionComponent<{}> = (props) => {
  return (
    <Layout>
      <AppComponent />
    </Layout>
  );
};

export default App;
