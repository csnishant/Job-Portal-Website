import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User2, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/constant";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleMenu = () => {
    if (showSidebar) {
      setMenuOpen(false);
      setTimeout(() => setShowSidebar(false), 200); // after animation
    } else {
      setShowSidebar(true);
      setMenuOpen(true);
    }
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
        toggleMenu(); // close menu
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="bg-white shadow-md w-full z-50 relative">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          Skill
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-600 font-extrabold">
            Linker
          </span>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {/* Navigation Links */}
          <ul className="flex gap-6 font-medium">
            {user?.role === "recruiter" ? (
              <>
                <Link to="/admin/companies">Companies</Link>
                <Link to="/admin/jobs">Jobs</Link>
              </>
            ) : (
              <>
                <Link to="/">Home</Link>
                <Link to="/jobs">Jobs</Link>
                <Link to="/browse">Browse</Link>
              </>
            )}
          </ul>

          {/* Auth Section */}
          {/* Auth Section */}
          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer shadow-sm">
                  <AvatarImage
                    className="object-cover"
                    src={user?.profile?.profilePhoto || ""}
                  />
                  <AvatarFallback>{user?.fullname?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="shadow-md bg-white rounded-md p-4 w-64 z-50">
                <div className="flex gap-4 items-center border-b pb-3 mb-3">
                  <Avatar>
                    <AvatarImage src={user?.profile?.profilePhoto || ""} />
                    <AvatarFallback>
                      {user?.fullname?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user?.fullname}</h4>
                    <p className="text-sm text-gray-500">
                      {user?.profile?.bio || "Student"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col text-gray-700 gap-2">
                  {user?.role === "student" && (
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 hover:text-black">
                      <User2 size={18} />
                      View Profile
                    </Link>
                  )}
                  <button
                    onClick={logoutHandler}
                    className="flex items-center gap-2 text-left hover:text-red-600">
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                  Signup
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden z-50">
          <button
            onClick={toggleMenu}
            className="transition-transform duration-300 transform">
            <span
              className={`inline-block transition-all duration-300 ease-in-out ${
                menuOpen ? "rotate-90 scale-110 opacity-80" : "rotate-0"
              }`}>
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </span>
          </button>
        </div>
      </div>

      {/* Sidebar for Mobile */}
      {showSidebar && (
        <div
          className={`absolute top-full left-0 w-full bg-white shadow-md rounded-b-lg md:hidden z-40 ${
            menuOpen ? "animate-slide-in" : "animate-slide-out"
          }`}>
          {user && (
            <div className="flex items-center gap-3 p-4 border-b shadow-sm bg-gray-50">
              <Avatar className="shadow-md">
                <AvatarImage
                  className="object-cover"
                  src={user?.profile?.profilePhoto || ""}
                />
                <AvatarFallback>{user?.fullname?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="text-base font-semibold">
                <Link to="/profile" onClick={toggleMenu}>
                  View Profile
                </Link>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-5 text-lg font-medium px-6 py-6">
            {user?.role === "recruiter" ? (
              <>
                <Link to="/admin/companies" onClick={toggleMenu}>
                  Companies
                </Link>
                <Link to="/admin/jobs" onClick={toggleMenu}>
                  Jobs
                </Link>
              </>
            ) : (
              <>
                <Link to="/" onClick={toggleMenu}>
                  Home
                </Link>
                <Link to="/jobs" onClick={toggleMenu}>
                  Jobs
                </Link>
                <Link to="/browse" onClick={toggleMenu}>
                  Browse
                </Link>
              </>
            )}

            {!user ? (
              <>
                <Link to="/login" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={toggleMenu}>
                  <Button className="w-full">Signup</Button>
                </Link>
              </>
            ) : (
              <Button
                variant="link"
                onClick={() => {
                  logoutHandler();
                }}
                className="w-full text-left">
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
