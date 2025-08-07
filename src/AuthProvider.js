
import React from "react";
import { DappProvider } from "@multiversx/sdk-dapp";

export const AuthProvider = ({ children }) => {
  return (
    <DappProvider
      environment={process.env.REACT_APP_NETWORK}
      customNetworkConfig={{
        name: "customDevnet",
        apiTimeout: 6000,
        walletConnectV2ProjectId: process.env.REACT_APP_WC_PROJECT_ID,
        apiUrl: process.env.REACT_APP_API_URL,
      }}
    >
      {children}
    </DappProvider>
  );
};
