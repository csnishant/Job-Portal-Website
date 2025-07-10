import React, { useEffect, useState } from "react";
import FilterCard from "./FilterCard";
import Job from "./Job";
import Navbar from "./shared/Navbar";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (searchedQuery) {
      const filteredJobs = allJobs.filter((job) =>
        [job.title, job.description, job.location, job.jobType].some((field) =>
          field.toLowerCase().includes(searchedQuery.toLowerCase())
        )
      );
      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className="w-full lg:w-1/4">
            <FilterCard />
          </div>

          {/* Job Listings */}
          <div className="w-full lg:w-3/4">
            {filterJobs.length <= 0 ? (
              <span className="text-gray-500">No jobs found</span>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}>
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
