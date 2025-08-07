
import React from "react";
import { AuthProvider } from "./AuthProvider";
import Login from "./Login";
import ScoreSubmit from "./ScoreSubmit";

function App() {
  return (
    <AuthProvider>
      <div style={{ padding: "2rem" }}>
        <h1>🏆 xPortal Score Submit Demo</h1>
        <Login />
        <hr />
        <ScoreSubmit />
      </div>
    </AuthProvider>
  );
}

export default App;
