
import React from "react";
import {
  WalletConnectLoginButton,
  useGetAccountInfo,
  logout,
} from "@multiversx/sdk-dapp";

export default function Login() {
  const { address } = useGetAccountInfo();

  return (
    <div>
      {address ? (
        <>
          <p>✅ Logat: <b>{address}</b></p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <WalletConnectLoginButton callbackRoute="/" buttonClassName="btn">
          Connect xPortal
        </WalletConnectLoginButton>
      )}
    </div>
  );
}
