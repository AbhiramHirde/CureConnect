import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/Appcontext";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  const logOut = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 px-6">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />

      <ul className="hidden md:flex items-center gap-8 font-medium">
        <li className="text-gray-800 hover:text-primary">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-primary font-bold" : "text-gray-800 hover:text-primary"
            }
          >
            HOME
          </NavLink>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto" />
        </li>

        <li className="text-gray-800 hover:text-primary">
          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              isActive ? "text-primary font-bold" : "text-gray-800 hover:text-primary"
            }
          >
            ALL DOCTORS
          </NavLink>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto" />
        </li>

        <li className="text-gray-800 hover:text-primary">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-primary font-bold" : "text-gray-800 hover:text-primary"
            }
          >
            ABOUT
          </NavLink>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto" />
        </li>

        <li className="text-gray-800 hover:text-primary">
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "text-primary font-bold" : "text-gray-800 hover:text-primary"
            }
          >
            CONTACT
          </NavLink>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto" />
        </li>
      </ul>

      {/* Profile / Login Button */}
      <div className="hidden md:block">
        {token && userData ? (
          <div className="flex items-center cursor-pointer group relative">
            <img className="w-8 rounded-full" src={userData.image} alt="Profile" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown Icon" />

            <div className="absolute top-0 right-0 pt-14 text-black text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p onClick={() => navigate("/my-profile")} className="hover:text-black cursor-pointer">
                  My Profile
                </p>
                <p onClick={() => navigate("/my-appointments")} className="hover:text-black cursor-pointer">
                  My Appointments
                </p>
                <p onClick={logOut} className="hover:text-black cursor-pointer">
                  Log Out
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-blue-700 transition duration-300"
          >
            Create Account
          </button>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <img
        onClick={() => setShowMenu(true)}
        className="w-6 md:hidden cursor-pointer"
        src={assets.menu_icon}
        alt="Menu"
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full bg-white transition-all ${
          showMenu ? "block" : "hidden"
        } md:hidden`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <img className="w-36" src={assets.logo} alt="Logo" />
          <img
            className="w-7 cursor-pointer"
            onClick={() => setShowMenu(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>

        <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
          <NavLink onClick={() => setShowMenu(false)} to="/">
            <p className="px-4 py-2 rounded inline-block">Home</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/doctors">
            <p className="px-4 py-2 rounded inline-block">All Doctors</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/about">
            <p className="px-4 py-2 rounded inline-block">About</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/contact">
            <p className="px-4 py-2 rounded inline-block">Contact</p>
          </NavLink>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
