import React from "react";
import NavBar from "./NavBar";

function Contact() {
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "YOUR_ACCESS_KEY_HERE");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());

    if (res.success) {
      console.log("Success", res);
    }
  };
  return (
    <div>
      <NavBar />

      <div className="main-container">
        <div className="contact-container">
          <h1>Contact FitLife Gym</h1>
          <p>Email: fitlifegym@gmail.com</p>
          <p>Phone: 0712345678</p>

          <form id="contactForm" onSubmit={onSubmit}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
            />

            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="Type your message"
              required
            ></textarea>
            <span id="messageError" className="error"></span>

            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;