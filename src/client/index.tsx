import React, { useMemo } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import {
  // getInstalledInjectedConnectors,
  InjectedConnector,
  StarknetProvider,
} from "@starknet-react/core";
import { BrowserRouter } from "react-router-dom";
import { AppStateProvider } from "./providers/GameContext";
import { NotifTransactionManagerProvider } from './providers/transactions'

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
// const connectors = getInstalledInjectedConnectors();

root.render(
  <>
{/* <StarknetProvider connectors={connectors}> */}
    <StarknetProvider connectors={[new InjectedConnector()]}>
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
