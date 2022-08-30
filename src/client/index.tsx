import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import {
  getInstalledInjectedConnectors,
  InjectedConnector,
  StarknetProvider,
} from "@starknet-react/core";
import { BrowserRouter } from "react-router-dom";
import { AppStateProvider } from "./providers/GameContext";
import { NotifTransactionManagerProvider } from "./providers/transactions";
import { keyManager } from "@starknet/burner";
const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
// const connectors = getInstalledInjectedConnectors();

const connectors = [
  new InjectedConnector({ options: { id: "589c80c1eb85413d" } }),
  new InjectedConnector({ options: { id: "argent-x" } }),
  new InjectedConnector({ options: { id: "braavos" } }),
];

keyManager();

root.render(
  <>
    <StarknetProvider connectors={connectors}>
      <NotifTransactionManagerProvider>
        <BrowserRouter>
          <AppStateProvider>
            <App />
          </AppStateProvider>
        </BrowserRouter>
      </NotifTransactionManagerProvider>
    </StarknetProvider>
  </>
);
