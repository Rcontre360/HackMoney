// import "tailwindcss/tailwind.css";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Layout from "../shared/layout";
import "../shared/styles/index.scss";
import "../shared/styles/global-tailwind.css";
import "../shared/styles/index.css";
import "../shared/styles/style.css";
import "../shared/styles/fonts.scss";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>ChainScore</title>
      </Head>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </LocalizationProvider>
      </Provider>
    </>
  );
}

export default MyApp;
