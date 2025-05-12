import React from "react";
import NavBar from "./NavBar";

function About() {
  return (
    <div>
      <NavBar />

      <div className="about-container" role="main">
        <h1>About FitLife Gym</h1>
        <p>
          Join us today and take the first step toward a healthier, stronger
          you!
        </p>
        <img
          src="assets/jelmer-assink-gzeTjGu3b_k-unsplash.jpg"
          alt="Gym Image showing
people working out"
        />
        <p>
          We are committed to helping you achieve your fitness goals. At FitLife
          Gym, we provide a welcoming and motivating environment for individuals
          of all fitness levels. Our state-of-the-art equipment, expert
          trainers, and diverse classes ensure you get the best workout
          experience possible.
        </p>
        <p>
          Founded in 2021, FitLife Gym has grown into a community where fitness
          enthusiasts come together to push their limits and achieve their
          health goals. Whether you're looking to build strength, lose weight,
          or enhance endurance, we have the right program for you.
        </p>
      </div>
    </div>
  );
}

export default About;
