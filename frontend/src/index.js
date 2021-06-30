import React from "react";
import ReactDOM from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  useMutation,
} from "@apollo/client";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import "./index.css";
import App from "./containers/App";
import reportWebVitals from "./reportWebVitals";
import "antd/dist/antd.css";
import { LOGIN_MUTATION } from "./graphql";
import AuthContext from "./context/auth-context"

const backend = process.env.REACT_APP_BACKEND_URL;

// Create an http link:
const httpLink = new HttpLink({
  uri: `http://${backend}`,
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://${backend}`,
  options: { reconnect: false },
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem(AUTH_TOKEN);
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "",
//     },
//   };
// });

const client = new ApolloClient({
  // link: authLink.concat(link),
  link,
  cache: new InMemoryCache().restore({}),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
