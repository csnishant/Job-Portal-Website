import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2, Mail, Lock, Phone, UserRound, UploadCloud } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
      if (key === "file" && value) formData.append("file", value);
      else formData.append(key, value);
    });

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center items-center px-4 sm:px-0">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md mt-10 bg-white rounded-xl shadow-md p-6 sm:p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>

          {/* Full Name */}
          <div>
            <Label className="text-sm text-gray-600">Full Name</Label>
            <div className="relative">
              <UserRound className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Input
                name="fullname"
                type="text"
                placeholder="John Doe"
                className="pl-9"
                value={input.fullname}
                onChange={changeEventHandler}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label className="text-sm text-gray-600">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="pl-9"
                value={input.email}
                onChange={changeEventHandler}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <Label className="text-sm text-gray-600">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Input
                name="phoneNumber"
                type="tel"
                placeholder="9876543210"
                className="pl-9"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <Label className="text-sm text-gray-600">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                className="pl-9"
                value={input.password}
                onChange={changeEventHandler}
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Role & File */}
          <div className="space-y-3">
            {/* Role selection */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                />
                Student
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                />
                Recruiter
              </label>
            </div>

            {/* File upload */}
            <div className="relative flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-gray-500" />
              <Label className="text-sm text-gray-700">Profile Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="flex-1 text-sm"
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
              Signup
            </Button>
          )}

          {/* Redirect */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
