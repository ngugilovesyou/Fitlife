import React, { useEffect, useState } from "react";
import DashNav from "./DashNav";

function Profile() {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetch("https://fitlife-7gmb.onrender.com/userInfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; 
  };
  const deleteUser = () => {
    fetch("https://fitlife-7gmb.onrender.com/delete", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "User deleted successfully") {
          alert("User deleted successfully!");
          window.location.href = "/login";
        } else {
          alert("Error deleting user.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error deleting user.");
      });
  };

  return (
    <>
      <DashNav />
      <div className="profile-container">
        <div className="profile-card">
          <p>
            <strong>Full Name:</strong> <span>{user.name}</span>
          </p>
          <p>
            <strong>Email:</strong> <span>{user.email}</span>
          </p>
          <p>
            <strong>Phone Number:</strong> <span>{user.phone}</span>
          </p>

          <p>
            <strong>Membership Type:</strong> <span>{user.membership}</span>
          </p>
          <p>
            <strong>Fitness Goals:</strong> <span>{user.goals}</span>
          </p>
          <div className="profile-btn">
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
            <button className="logout-btn" onClick={deleteUser}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
