
import React from "react";
import { useGetAccountInfo, useSignMessage } from "@multiversx/sdk-dapp";

export default function ScoreSubmit() {
  const { address } = useGetAccountInfo();
  // useSignMessage is a React hook and must be called at the top level of
  // the component. It exposes a `signMessage` function that can be used to
  // sign arbitrary messages. The previous implementation attempted to call
  // the hook inside the submit handler which breaks the Rules of Hooks and
  // causes runtime errors.
  const { signMessage } = useSignMessage();

  const submitScore = async () => {
    const score = Math.floor(Math.random() * 1000);
    const message = `score:${score}`;

    try {
      // Sign the score message using the signMessage function returned by
      // the useSignMessage hook.
      const { signature } = await signMessage({ message });
      const res = await fetch(`${process.env.REACT_APP_API_URL}/submit-score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          score,
          signature,
        }),
      });

      const data = await res.json();
      alert(`Scor trimis! Serverul a răspuns: ${data.status}`);
    } catch (err) {
      console.error(err);
      alert("Eroare la semnare sau trimitere scor.");
    }
  };

  return (
    <div>
      {address && (
        <button onClick={submitScore}>
          Trimite scor semnat
        </button>
      )}
    </div>
  );
}
