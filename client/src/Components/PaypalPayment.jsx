/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "../index.css";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import useStore from "./Store";

const PaypalPayment = () => {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({ name: "", email: "" });
  const navigate = useNavigate();
  const { membershipSelected } = useStore();

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("You need to be logged in to proceed with payment.");
          return;
        }

        const response = await fetch("http://localhost:5000/userInfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();

        if (!data.membership) {
          throw new Error("Membership information is missing from user data.");
        }

        setUser({
          name: data.name,
          email: data.email,
          membership: data.membership, 
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
        setMessage("Failed to retrieve user information.");
      }
    };

    fetchUserInfo();
  }, []);

  const handlePaymentSuccess = async (transactionId, userEmail) => {
    await fetch("http://localhost:5000/update-payment-status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transaction_id: transactionId, email: userEmail }),
    });

    navigate("/dashboard");
  };

  return (
    <div className="paypal-container">
      <h2 className="paypal-title">Pay for {user.membership} Membership</h2>

      <PayPalButtons
        style={{
          shape: "rect",
          layout: "vertical",
          color: "gold",
          label: "paypal",
        }}
        createOrder={async () => {
          try {
            if (!user.name || !user.email || !user.membership) {
              throw new Error("User information is incomplete.");
            }
            const response = await fetch("http://localhost:5000/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                membership: user.membership,
                name: user.name,
                email: user.email,
              }),
            });

            const orderData = await response.json();

            if (orderData.id) {
              return orderData.id;
            } else {
              const errorDetail = orderData?.details?.[0];
              throw new Error(
                errorDetail?.description || "Order creation failed"
              );
            }
          } catch (error) {
            console.error(error);
            setMessage(
              `Could not initiate PayPal Checkout... ${error.message}`
            );
          }
        }}
        onApprove={async (data, actions) => {
          try {
            const response = await fetch(
              `http://localhost:5000/api/orders/${data.orderID}/capture`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const orderData = await response.json();

            if (orderData?.details?.[0]?.issue === "INSTRUMENT_DECLINED") {
              return actions.restart();
            } else if (orderData?.status === "COMPLETED") {
              const transaction =
                orderData.purchase_units[0].payments.captures[0];
              setMessage(
                `Transaction ${transaction.status}: ${transaction.id}`
              );

              // Update payment status in DB
              await handlePaymentSuccess(transaction.id, user.email);

              // Save the payment in the database
              const paymentData = {
                membership: user.membership,
                transaction_id: transaction.id,
                amount: transaction.amount.value,
                payer_name: user.name,
              };

              // Send the payment data to backend to store it
              const paymentResponse = await fetch(
                "http://localhost:5000/capture-payment",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify(paymentData),
                }
              );

              const paymentResult = await paymentResponse.json();
              // console.log(paymentResult);
              if (paymentResult.success) {
                console.log("Payment saved in the database.");
              } else {
                console.error("Failed to save payment.");
              }
            } else {
              throw new Error("Transaction failed");
            }
          } catch (error) {
            console.error(error);
            setMessage(
              `Sorry, your transaction could not be processed... ${error.message}`
            );
          }
        }}
      />

      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default PaypalPayment;
