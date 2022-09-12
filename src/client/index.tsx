import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { getInstalledInjectedConnectors, InjectedConnector, StarknetProvider } from "@starknet-react/core";
import { BrowserRouter } from "react-router-dom";
import { AppStateProvider } from "./providers/GameContext";
import { NotifTransactionManagerProvider } from './providers/transactions'
import { register } from "@starknet/burner";

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
// const connectors = getInstalledInjectedConnectors();

register();

const connectors = [
  new InjectedConnector({ options: { id: 'argentX' } }),
  new InjectedConnector({ options: { id: 'braavos' } }),
  new InjectedConnector({ options: { id: 'burner' } }),
]



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
