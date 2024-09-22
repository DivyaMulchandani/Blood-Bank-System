import React from "react";
import {
  BiSolidDonateBlood,
  BiLogOutCircle,
  BiUserCircle,
} from "react-icons/bi";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  //logout handler
  const handleLogout = () => {
    localStorage.clear();
    toast.error("You are loged out");
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="container-fluid">
          <div className="navbar-brand">
            <a className="navbar-brand mx-4" href="#">
              <BiSolidDonateBlood color="red" />
              Blood Bank
            </a>
          </div>
          <ul className="navbar-nav flex-row">
            <li className="nav-item mx-3">
              <p className="nav-link">
                <BiUserCircle />
                welcome{" "}
                {user?.name ||
                  user?.hospitalName ||
                  user?.organisationName}{" "}
                &nbsp;
                <span class="badge text-bg-secondary">{user?.role}</span>
              </p>
            </li>
            {location.pathname === "/" ||
            location.pathname === "/donar" ||
            location.pathname === "/hospital" ? (
              <li className="nav-item mx-3">
                <Link to="/analytics" className="nav-link">
                  Analytics
                </Link>
              </li>
            ) : (
              <li className="nav-item mx-3">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
            )}
            <li className="nav-item mx-3">
              <button className="btn btn-danger" onClick={handleLogout}>
                <BiLogOutCircle /> logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
