import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "../styles/globals.css";
import type { AppProps } from "next/app";

const darkTheme = createTheme({
  palette: {
    mode: "light",
    // mode: "dark",

    primary: {
      main: "#00a3bc",
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Component {...pageProps} />;
    </ThemeProvider>
  );
}

export default MyApp;
