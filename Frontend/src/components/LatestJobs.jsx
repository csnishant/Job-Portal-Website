import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center sm:text-left">
        <span className="text-[#6A38C2]">Latest & Top </span> Job Openings
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {allJobs.length <= 0 ? (
          <span className="text-gray-500">No Job Available</span>
        ) : (
          allJobs
            ?.slice(0, 6)
            .map((job) => <LatestJobCards key={job._id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
