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
import { SelectStateProvider } from "./providers/SelectContext";
import { NewAppStateProvider } from "./providers/NewGameContext";

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
// const connectors = getInstalledInjectedConnectors();

const connectors = [
  new InjectedConnector({ options: { id: "argentX" } }),
  new InjectedConnector({ options: { id: "braavos" } }),
];

root.render(
  <>
    <StarknetProvider connectors={connectors}>
      <NotifTransactionManagerProvider>
        <BrowserRouter>
          <AppStateProvider>
            <NewAppStateProvider>
              <SelectStateProvider>
                <App />
              </SelectStateProvider>
            </NewAppStateProvider>
          </AppStateProvider>
        </BrowserRouter>
      </NotifTransactionManagerProvider>
    </StarknetProvider>
  </>
);
