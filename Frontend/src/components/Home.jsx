import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import HeroSection from "../components/HeroSection.jsx";

import LatestJobs from "./LatestJobs";
import CategoryCarausel from "./CategoryCarausel";
import Footer from "./shared/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  useGetAllJobs();

  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, []);

  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarausel />
      <LatestJobs />
      <Footer />
    </div>
  );
};

export default Home;
