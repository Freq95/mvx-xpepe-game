
import React from "react";
import { useGetAccountInfo, useSignMessage  } from "@multiversx/sdk-dapp";

export default function ScoreSubmit() {
  const { address } = useGetAccountInfo();

  const submitScore = async () => {
    const score = Math.floor(Math.random() * 1000);
    const message = `score:${score}`;

    try {
      const { signature } = await useSignMessage(message);
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
