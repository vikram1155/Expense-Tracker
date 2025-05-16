import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import theme from "./theme.tsx";
import { ThemeProvider } from "@mui/material";
import store from "./redux/store.ts";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    {/* <StrictMode> */}
    <Provider store={store}>
      <App />
    </Provider>
    {/* </StrictMode> */}
  </ThemeProvider>
);
