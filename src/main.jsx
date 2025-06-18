import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { AuthProvider } from "./auth/AuthProvider";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import theme from "./theme/theme";
import "./styles/global.css"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-responsive-carousel/lib/styles/carousel.min.css';





ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Este debe envolver TODO */}
        <CssBaseline />
        <AuthProvider>
      <ThemeProvider theme={theme}>
          <App />
      </ThemeProvider>
        </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
