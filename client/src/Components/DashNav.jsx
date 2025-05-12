import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
function DashNav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div id="navbar-container">
      <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      <nav className={isOpen ? "nav-menu open" : "nav-menu"}>
        <NavLink to={"/"} onClick={() => setIsOpen(false)}>
          Home
        </NavLink>
        <NavLink to={"/dashboard"} onClick={() => setIsOpen(false)}>
          My Dashboard
        </NavLink>
        <NavLink to={"/profile"} onClick={() => setIsOpen(false)}>
          My Profile
        </NavLink>
        
      </nav>
    </div>
  );
}

export default DashNav;
