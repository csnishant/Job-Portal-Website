import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import React from "react";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className=" my-4 p-5 rounded-md shadow-lg shadow-pink-500/50 cursor-pointer transition-transform duration-300 hover:shadow-indigo-500/50  hover:-translate-y-4  ">
      <div>
        <h1 className="font-medium text-lg">{job?.company?.name}</h1>
        <p>India</p>
      </div>
      <div>
        <h1 className="font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-sm text-gray-400">{job?.description}</p>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Badge className={"text-blue-700 font-bold"} variant="ghost">
          {job?.position} Position
        </Badge>

        <Badge className={"text-[#F83002] font-bold"} variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
