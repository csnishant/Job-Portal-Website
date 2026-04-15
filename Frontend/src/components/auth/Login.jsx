import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2, Mail, Lock, UserRound } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",

  });

  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

 const submitHandler = async (e) => {
   e.preventDefault();
   try {
     dispatch(setLoading(true));
     const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
       headers: { "Content-Type": "application/json" },
       withCredentials: true,
     });

     if (res.data.success) {
       const loggedInUser = res.data.user;
       dispatch(setUser(loggedInUser));
       toast.success(res.data.message);

       // Automatic Role Detection & Navigation
       if (loggedInUser.role === "recruiter") {
         navigate("/admin/companies"); // Recruiter dashboard
       } else {
         navigate("/"); // Student home page
       }
     }
   } catch (error) {
     toast.error(error.response?.data?.message || "Something went wrong");
   } finally {
     dispatch(setLoading(false));
   }
 };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center items-center px-4 sm:px-0">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md mt-10 bg-white rounded-xl shadow-md p-6 sm:p-8 space-y-6 transition-all duration-300">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Login
          </h2>

          {/* Email */}
          <div>
            <Label className="text-sm text-gray-600">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="you@example.com"
                className="pl-9"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <Label className="text-sm text-gray-600">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="••••••••"
                className="pl-9"
                autoComplete="current-password"
              />
            </div>
          </div>


          {/* Submit Button */}
          {loading ? (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Login
            </Button>
          )}

          {/* Redirect */}
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
