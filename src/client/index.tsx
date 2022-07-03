import React, { useMemo } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import {
  getInstalledInjectedConnectors,
  StarknetProvider,
} from "@starknet-react/core";
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
const connectors = getInstalledInjectedConnectors();

root.render(
  <React.StrictMode>
    <StarknetProvider connectors={connectors}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StarknetProvider>
  </React.StrictMode>
);
