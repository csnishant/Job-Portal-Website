import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) =>
        application.applicant === user?._id || application === user?._id,
    ) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const [atsData, setAtsData] = useState(null);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const checkATSHandler = async () => {
    if (!resume) {
      toast.error("Please upload a resume first.");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", resume);
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/check-ats/${jobId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        setAtsData(res.data.data);
        toast.success(`ATS Score: ${res.data.data.score}%`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error checking ATS");
    } finally {
      setLoading(false);
    }
  };

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true },
      );
      if (res.data.success) {
        setIsApplied(true);
        const updateSingleJob = {
          ...singleJob,
          applications: [
            ...singleJob.applications,
            { applicant: user?._id, status: "applied" },
          ],
        };
        dispatch(setSingleJob(updateSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (app) => app.applicant === user?._id || app === user?._id,
            ),
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="max-w-7xl mx-auto my-10 p-5 rounded-md shadow-lg border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">{singleJob?.title}</h1>
          <p className="text-sm text-gray-500 font-medium">
            {singleJob?.company?.name || "Company Name"}
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge className={"text-blue-700 font-bold"} variant="ghost">
              {singleJob?.position} Positions
            </Badge>
            <Badge className={"text-[#F83002] font-bold"} variant="ghost">
              {singleJob?.jobType}
            </Badge>
            <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
              {singleJob?.salary} LPA
            </Badge>
            <Badge className={"text-green-600 font-bold"} variant="ghost">
              {singleJob?.location}
            </Badge>
          </div>
        </div>

        {!isApplied ? (
          <div className="flex flex-col gap-2 items-end">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700"
            />
            <div className="flex gap-2">
              <Button
                onClick={checkATSHandler}
                disabled={loading || !resume}
                variant="outline">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Check ATS Score"
                )}
              </Button>
              <Button
                onClick={applyJobHandler}
                disabled={!atsData || atsData.score < 50}
                className={`rounded-lg ${!atsData || atsData.score < 50 ? "bg-gray-400" : "bg-[#7209b7] hover:bg-[#5f079b]"}`}>
                Apply Now
              </Button>
            </div>
            {atsData && (
              <p
                className={`text-xs font-bold ${atsData.score < 50 ? "text-red-500" : "text-green-600"}`}>
                Score: {atsData.score}%{" "}
                {atsData.score < 50 && "(Min. 50% required)"}
              </p>
            )}
          </div>
        ) : (
          <Button
            disabled
            className="bg-gray-600 rounded-lg cursor-not-allowed">
            Already Applied
          </Button>
        )}
      </div>

      <div className="my-10">
        <h1 className="border-b-2 border-b-gray-300 font-medium py-4 text-lg">
          Job Details
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <DetailRow label="Role" value={singleJob?.title} />
          <DetailRow label="Location" value={singleJob?.location} />
          <DetailRow
            label="Experience"
            value={`${singleJob?.experienceLevel} years`}
          />
          <DetailRow label="Salary" value={`${singleJob?.salary} LPA`} />
          <DetailRow label="Job Type" value={singleJob?.jobType} />
          <DetailRow
            label="Total Applicants"
            value={singleJob?.applications?.length}
          />
          <DetailRow
            label="Posted Date"
            value={singleJob?.createdAt?.split("T")[0]}
          />
        </div>

        <div className="my-6">
          <h2 className="font-bold text-gray-800">Description:</h2>
          <p className="text-gray-600 mt-1 leading-relaxed">
            {singleJob?.description}
          </p>
        </div>

        {/* Requirements Array Render */}
        {singleJob?.requirements?.length > 0 && (
          <div className="my-6">
            <h2 className="font-bold text-gray-800">Requirements:</h2>
            <ul className="list-disc list-inside mt-2 text-gray-600">
              {singleJob.requirements.map((req, index) => (
                <li key={index} className="mt-1">
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable component for clean UI
const DetailRow = ({ label, value }) => (
  <h1 className="font-bold my-1">
    {label}:{" "}
    <span className="pl-4 font-normal text-gray-700">{value || "N/A"}</span>
  </h1>
);

export default JobDescription;
