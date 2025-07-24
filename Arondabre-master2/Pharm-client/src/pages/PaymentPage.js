import React, { useEffect } from "react";

const PaymentPage = () => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const response = await fetch("http://localhost:5000/api/payment/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!data.id) {
      alert("Order creation failed");
      return;
    }

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag", // ✅ Replace with your actual Razorpay key
      amount: data.amount,
      currency: data.currency,
      order_id: data.id,
      name: "Medisphere",
      description: "Medicine Order",
      handler: function (response) {
        alert("Payment successful!");
        window.location.href = "/success";
      },
      prefill: {
        name: "Customer",
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
    <div style={{ textAlign: "center", marginTop: "10rem" }}>
      <h2>Pay for your Medicines</h2>
      <button
        onClick={handlePayment}
        style={{
          padding: "12px 24px",
          fontSize: "18px",
          backgroundColor: "#008CBA",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Pay ₹100
      </button>
    </div>
  );
};

export default PaymentPage;
