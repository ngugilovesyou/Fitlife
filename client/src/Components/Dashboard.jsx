/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import DashNav from "./DashNav";

function Dashboard() {
 const [selectedGoal, setSelectedGoal] = useState(null);
 const [userPlan, setUserPlan] = useState(null);
  const [user, setUser] = useState([])

 useEffect(() => {
   fetchUserGoal();
 }, []);

 const fetchUserGoal = () => {
   fetch("http://localhost:5000/userInfo", {
     method: "GET",
     headers: {
       Authorization: `Bearer ${localStorage.getItem("token")}`,
     },
   })
     .then((response) => response.json())
     .then((data) => {
       setSelectedGoal(data.goals);
       setUserPlan(getPlan(data.goals));
       setUser(data)
     })
     .catch((error) => console.error("Error fetching user data:", error));
 };

  const getPlan = (goal) => {
    switch (goal) {
      case "Lose Weight":
        return {
          workoutPlan: [
            {
              day: "Monday",
              workout: "HIIT (Jump Squats, Burpees, Mountain Climbers)",
              reps: "30 sec on, 15 sec rest (4 rounds)",
            },
            {
              day: "Tuesday",
              workout: "Strength Training (Full Body)",
              reps: "3 sets x 12 reps",
            },
            {
              day: "Wednesday",
              workout: "Cardio (Running, Cycling, Jump Rope)",
              reps: "30-40 minutes",
            },
            {
              day: "Thursday",
              workout: "Core & Abs (Planks, Russian Twists, Bicycle Crunches)",
              reps: "3 sets x 15 reps",
            },
            {
              day: "Friday",
              workout: "HIIT (Kettlebell Swings, Rowing Machine, Jump Lunges)",
              reps: "30 sec on, 15 sec rest (4 rounds)",
            },
          ],
          dietPlan: [
            {
              meal: "Breakfast",
              plan: "Scrambled eggs with spinach + whole wheat toast",
            },
            { meal: "Snack", plan: "Greek yogurt + berries" },
            {
              meal: "Lunch",
              plan: "Grilled chicken salad (greens, avocado, olive oil dressing)",
            },
            { meal: "Snack", plan: "Almonds + black coffee/green tea" },
            { meal: "Dinner", plan: "Baked salmon + steamed veggies" },
          ],
        };
      case "Build Muscle":
        return {
          workoutPlan: [
            {
              day: "Monday",
              workout: "Chest & Triceps (Bench Press, Dips, Push-ups)",
              reps: "4 sets x 8-12 reps",
            },
            {
              day: "Tuesday",
              workout: "Back & Biceps (Pull-ups, Deadlifts, Rows)",
              reps: "4 sets x 8-12 reps",
            },
            {
              day: "Wednesday",
              workout: "Legs (Squats, Lunges, Leg Press)",
              reps: "4 sets x 10 reps",
            },
            {
              day: "Thursday",
              workout:
                "Shoulders & Abs (Overhead Press, Lateral Raises, Planks)",
              reps: "4 sets x 12 reps",
            },
            {
              day: "Friday",
              workout:
                "Full-Body Strength (Compound Lifts, Functional Training)",
              reps: "3 sets x 8-12 reps",
            },
            {
              day: "Saturday",
              workout: "Active Recovery (Yoga, Mobility Drills)",
              reps: "-",
            },
          ],
          dietPlan: [
            {
              meal: "Breakfast",
              plan: "Scrambled eggs + whole grain toast + banana",
            },
            { meal: "Snack", plan: "Protein shake + peanut butter" },
            {
              meal: "Lunch",
              plan: "Grilled chicken + quinoa + steamed veggies",
            },
            { meal: "Snack", plan: "Cottage cheese + almonds" },
            {
              meal: "Dinner",
              plan: "Lean steak + sweet potatoes + sautéed greens",
            },
          ],
        };
      case "Stay Fit":
        return {
          workoutPlan: [
            {
              day: "Monday",
              workout: "Full Body Circuit (Squats, Push-ups, Plank, Jump Rope)",
              reps: "3 sets x 12 reps",
            },
            {
              day: "Tuesday",
              workout: "Yoga & Mobility (Stretching, Balance Training)",
              reps: "45 minutes",
            },
            {
              day: "Wednesday",
              workout: "Strength Training (Deadlifts, Presses, Pull-ups)",
              reps: "4 sets x 10 reps",
            },
            {
              day: "Thursday",
              workout: "Outdoor Activity (Hiking, Swimming, Cycling)",
              reps: "30-60 minutes",
            },
            {
              day: "Friday",
              workout: "Core & Stability (Planks, Med Ball Exercises)",
              reps: "3 sets x 15 reps",
            },
          ],
          dietPlan: [
            { meal: "Breakfast", plan: "Oatmeal + nuts + honey" },
            {
              meal: "Snack",
              plan: "Smoothie (banana, protein powder, almond milk)",
            },
            { meal: "Lunch", plan: "Grilled fish + brown rice + veggies" },
            { meal: "Snack", plan: "Hummus + carrots" },
            { meal: "Dinner", plan: "Chicken stir-fry + quinoa" },
          ],
        };
      default:
        return null;
    }
  };

  if (!userPlan) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DashNav />
      <div className="dashboard-container">
        <h2>Welcome, {user.name} 👋</h2>
        <p>
          Your Fitness Goal: <strong>{user.goals}</strong>
        </p>

        <div className="dashboard-grid">
          {/* Workout Plan */}
          <div className="dashboard-card">
            <h3>Workout Plan 🏋️</h3>
            <ul>
              {userPlan.workoutPlan.length > 0 ? (
                userPlan.workoutPlan.map((workout, index) => (
                  <li key={index}>
                    <strong>{workout.day}:</strong> {workout.workout} (
                    {workout.reps})
                  </li>
                ))
              ) : (
                <p>No workout plan available.</p>
              )}
            </ul>
          </div>

          {/* Diet Plan */}
          <div className="dashboard-card">
            <h3>Diet Plan 🥗</h3>
            <ul>
              {userPlan.dietPlan.length > 0 ? (
                userPlan.dietPlan.map((meal, index) => (
                  <li key={index}>
                    <strong>{meal.meal}:</strong> {meal.plan}
                  </li>
                ))
              ) : (
                <p>No diet plan available.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
