import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { SelectStateProvider } from "./providers/SelectContext";
import { NewAppStateProvider } from "./providers/NewGameContext";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  DefaultOptions,
} from "@apollo/client";

const httpLink = createHttpLink({
  uri: "https://goerli.indexer.frenslands.xyz/graphql",
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    // errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
  defaultOptions: defaultOptions,
});

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(
  <>
    <ApolloProvider client={client}>
        <BrowserRouter>
          <NewAppStateProvider>
            <SelectStateProvider>
              <App />
            </SelectStateProvider>
          </NewAppStateProvider>
        </BrowserRouter>
    </ApolloProvider>
  </>
);
