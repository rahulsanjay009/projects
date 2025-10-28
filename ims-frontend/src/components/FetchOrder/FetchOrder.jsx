import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FetchOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!orderNumber.trim()) return;
    navigate(`/order/${orderNumber}`); // ✅ Go to OrderDetailPage
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", textAlign: "center" }}>
      <h2>Fetch Order</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Enter Order Number"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{
            padding: "0.5rem",
            width: "60%",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#1976d2",
            color: "white",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default FetchOrder;
