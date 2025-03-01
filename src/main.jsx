import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Layout } from "./components/Layout.jsx";
import App from "./App.jsx";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#232323",
    },
  },
  typography: {
    fontSize: 18,
  },
});

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme} noSsr>
    <CssBaseline />
    <StrictMode>
      <Layout title="Trivia Game" icon="psychology_alt">
        <App />
      </Layout>
    </StrictMode>
  </ThemeProvider>
);
