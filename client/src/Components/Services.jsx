import React from "react";
import NavBar from "./NavBar";

function Services() {
  return (
    <div>
      <NavBar />
      <div className="services-container">
        <h1>Our Services</h1>
        <p>Explore the wide range of services we offer at FitLife Gym.</p>
        <div className="services-images">
          <img
            src="assets/How To Become A PureGym Personal Trainer.jpg"
            alt="Personal Training"
            className="services-image"
          />
          <img
            src="assets/Is There a New Yoga Alliance Competitor on the Scene_.jpg"
            alt="Yoga Class"
            className="services-image"
          />
          <img
            src="assets/download.jpg"
            alt="Weight Training"
            className="services-image"
          />
          <img
            src="assets/Boost Your Endurance with Cardio Workouts at Home.jpg"
            alt="Cardio Workout"
            className="services-image"
          />
          <img
            src="assets/Fuel Your Body with Healthy Meals 🍽️ _ Nourish for Success_Dynamic Body Bliss.jpg"
            alt="Nutrition Plan"
            className="services-image"
          />
        </div>
      </div>

      <h2>Our Services Include:</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Service</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Personal Training</td>
            <td>
              One-on-one training sessions tailored to individual fitness goals.
            </td>
          </tr>
          <tr>
            <td>Group Classes</td>
            <td>
              Fun and engaging fitness classes like Zumba, Yoga, and HIIT.
            </td>
          </tr>
          <tr>
            <td>Weight Training</td>
            <td>
              Strength-building exercises using free weights and machines.
            </td>
          </tr>
          <tr>
            <td>Cardio Sessions</td>
            <td>
              Heart-pumping workouts including treadmill, cycling, and rowing.
            </td>
          </tr>
          <tr>
            <td>Nutrition Coaching</td>
            <td>Guidance on diet plans to support fitness and health goals.</td>
          </tr>
          <tr>
            <td>Sauna & Recovery</td>
            <td>
              Relaxing post-workout recovery in a sauna or massage therapy.
            </td>
          </tr>
          <tr>
            <td>Swimming Pool Access</td>
            <td>
              Access to an indoor or outdoor swimming pool for fitness and
              leisure.
            </td>
          </tr>
          <tr>
            <td>Physical Therapy</td>
            <td>
              Rehabilitation services for injury recovery and mobility
              improvement.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Services;
