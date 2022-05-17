// import "tailwindcss/tailwind.css";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Layout from "../shared/layout";
import "../shared/styles/index.scss";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LocalizationProvider>
    </Provider>
  );
}

export default MyApp;
