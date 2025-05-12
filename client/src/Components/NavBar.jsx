import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";


function NavBar() {
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
        <NavLink to={"/about"} onClick={() => setIsOpen(false)}>
          About
        </NavLink>
        <NavLink to={"/contact"} onClick={() => setIsOpen(false)}>
          Contact
        </NavLink>
        <NavLink to={"/services"} onClick={() => setIsOpen(false)}>
          Services
        </NavLink>
        <NavLink to={"/membership"} onClick={() => setIsOpen(false)}>
          Membership
        </NavLink>
        <NavLink
          to={"/login"}
          className="login"
          onClick={() => setIsOpen(false)}
        >
          Login
        </NavLink>
      </nav>
    </div>
  );
}

export default NavBar;
