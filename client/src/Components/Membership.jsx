/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import useStore from "./Store";

function Membership() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
    membership: "",
    goals: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { membershipSelected, setMembershipSelected } = useStore();
  const [showPayment, setShowPayment] = useState(false);

  const navigate = useNavigate();

  // Validation Functions (same as before)
  const validateName = (name) =>
    /^[a-zA-Z\s]+$/.test(name) ? "" : "Name should contain only alphabets.";
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Invalid email format.";
  const validatePhone = (phone) =>
    /^\d{10}$/.test(phone) ? "" : "Phone number should be 10 digits.";
  const validateDOB = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    return dobDate > today || age < 18
      ? "You must be at least 18 years old."
      : "";
  };
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    )
      ? ""
      : "Password must have at least 8 characters, uppercase, lowercase, number, and special character.";
  const validateConfirmPassword = (password, confirmPassword) =>
    password === confirmPassword ? "" : "Passwords do not match.";
  const validateMembership = (membership) =>
    membership ? "" : "Please select a membership type.";

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validate Current Step
  const validateStep = () => {
    let newErrors = {};

    if (step === 1) {
      newErrors.name = validateName(formData.name);
      newErrors.email = validateEmail(formData.email);
      newErrors.phone = validatePhone(formData.phone);
    }
    if (step === 2) {
      newErrors.dob = validateDOB(formData.dob);
      newErrors.password = validatePassword(formData.password);
      newErrors.confirmPassword = validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      );
    }
    if (step === 3) {
      newErrors.membership = validateMembership(formData.membership);
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // Handle Next Step
  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  // Handle Previous Step
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  //  Handle membership
  const handleMembershipChange = (e) => {
    setMembershipSelected(e.target.value);
    handleChange(e);
  };
  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      try {
        // Add membership to the formData before sending to the backend
        const response = await fetch("http://localhost:5000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("data from registration", data)
        alert("Registration Successful");
        navigate('/login')
      } catch (error) {
        console.error("Error creating order:", error);
        alert("Failed to create PayPal order.");
      }
    }
  };

  return (
    <>
      <div id="membership-container">
        <NavBar />
        <div id="membership">
          <div className="form-container">
            <h2>Gym Membership Form</h2>
            <form id="membershipForm" onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <span className="error">{errors.name}</span>

                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <span className="error">{errors.email}</span>

                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <span className="error">{errors.phone}</span>
                </>
              )}
              {step === 2 && (
                <>
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                  <span className="error">{errors.dob}</span>

                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span className="error">{errors.password}</span>

                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <span className="error">{errors.confirmPassword}</span>
                </>
              )}
              {step === 3 && (
                <>
                  <label htmlFor="membership">Membership Type</label>
                  <select
                    id="membership"
                    name="membership"
                    value={formData.membership}
                    onChange={handleMembershipChange}
                  >
                    <option value="">Select a membership type</option>
                    <option value="monthly">Monthly - $50</option>
                    <option value="quarterly">Quarterly - $140</option>
                    <option value="yearly">Yearly - $500</option>
                  </select>
                  <span className="error">{errors.membership}</span>

                  <label htmlFor="goals">What's your goal</label>
                  <select
                    id="goals"
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                  >
                    <option value="">Select your goal</option>
                    <option value="Lose Weight">To lose weight</option>
                    <option value="Build Muscle"> Build Muscle</option>
                    <option value="Stay Fit"> To stay fit</option>
                  </select>
                  <span className="error">{errors.goals}</span>
                </>
              )}

              <div className="form-navigation">
                {step > 1 && (
                  <button type="button" onClick={prevStep}>
                    Previous
                  </button>
                )}
                {step < 3 ? (
                  <button type="button" onClick={nextStep}>
                    Next
                  </button>
                ) : (
                  <button type="submit">Join Now</button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Membership;
