import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { setSearchedQuery } from "@/redux/jobSlice";

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Heading */}
        <h1 className="font-bold text-2xl sm:text-3xl mb-6 text-center sm:text-left">
          Search Results ({allJobs.length})
        </h1>

        {/* Grid of Jobs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allJobs.map((job) => (
            <Job key={job._id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;
