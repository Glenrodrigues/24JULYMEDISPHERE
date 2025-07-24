// src/components/RazorpayButton.jsx

import React from "react";

const RazorpayButton = ({ amount, onSuccess }) => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const orderResponse = await fetch("http://localhost:5000/api/payment/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const order = await orderResponse.json();

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag", // ✅ your test Razorpay key
      amount: order.amount,
      currency: order.currency,
      name: "Medisphere",
      description: "Cart Payment",
      order_id: order.id,
      handler: function (response) {
        onSuccess(response);
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button
      onClick={handlePayment}
      style={{
        width: "100%",
        padding: "12px",
        fontSize: "6px",
        background: "#c9cfd9ff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        marginTop: "10px",
        cursor: "pointer",
      }}
    >
      Pay ₹{amount / 100}
    </button>
  );
};

export default RazorpayButton;
