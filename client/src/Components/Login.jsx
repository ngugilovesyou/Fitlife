/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import PaypalPayment from "./PaypalPayment";
import useStore from "./Store";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasPaid, setHasPaid] = useState(null);
  const navigate = useNavigate();
  const { membershipSelected } = useStore();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (!data.token || !data.user) {
        alert(data.error || "Login failed. Check credentials.");
        return;
      }

      localStorage.setItem("token", data.token);

      const paymentStatus = data.has_paid;
      setHasPaid(data.has_paid === 1 ? true : false);

      if (paymentStatus === 1) {
        navigate("/dashboard");
      } else {
        navigate("/login", {
          state: { showPaypal: true, membershipSelected },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const initialOptions = {
    clientId:import.meta.env.VITE_PAYPAL_CLIENT_ID
    currency: "USD",
    intent: "capture",
  };

  return (
    <>
      <NavBar />
      <PayPalScriptProvider options={initialOptions}>
        <div className="login-container">
          <div className="form-container">
            <h2>Login to FitLife</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit">Login</button>
            </form>

            {/* Conditionally show PayPal if user has not paid */}
            {hasPaid === false && <PaypalPayment />}
          </div>
        </div>
      </PayPalScriptProvider>
    </>
  );
}

export default Login;
