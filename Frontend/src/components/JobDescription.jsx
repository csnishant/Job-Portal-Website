import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Loading icon ke liye

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) =>
        application.applicant === user?._id && application.status === "applied",
    ) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const [atsData, setAtsData] = useState(null);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  // 1. ATS Score Check karne ka function
const checkATSHandler = async () => {
  if (!resume) {
    toast.error("Please upload a resume first.");
    return;
  }

  try {
    setLoading(true);
    const formData = new FormData();

    // "resume" wahi name hona chahiye jo backend mein upload.single("resume") hai
    formData.append("resume", resume);

    const res = await axios.post(
      `${APPLICATION_API_END_POINT}/check-ats/${jobId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Yeh header important hai
        },
        withCredentials: true,
      },
    );

    if (res.data.success) {
      setAtsData(res.data.data);
      toast.success(`ATS Score: ${res.data.data.score}%`);
      console.log("ATS Result:", res.data.data);
    }
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Error checking ATS");
  } finally {
    setLoading(false);
  }
};

  // 2. Final Apply karne ka function
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
              (application) =>
                application.applicant === user?._id &&
                application.status === "applied",
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
          <h1 className="font-bold text-xl">{singleJob?.title}</h1>
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
          </div>
        </div>

        {/* Agar apply nahi kiya hai toh ATS upload dikhao */}
        {!isApplied && (
          <div className="flex flex-col gap-2 items-end">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
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
                disabled={isApplied || !atsData || atsData.score < 50}
                className={`rounded-lg ${isApplied ? "bg-gray-600" : "bg-[#7209b7] hover:bg-[#5f079b]"}`}>
                {isApplied ? "Already Applied" : "Apply Now"}
              </Button>
            </div>
            {atsData && (
              <p
                className={`text-sm font-bold ${atsData.score < 50 ? "text-red-500" : "text-green-600"}`}>
                Last Checked Score: {atsData.score}%{" "}
                {atsData.score < 50 && "(Too low to apply)"}
              </p>
            )}
          </div>
        )}
        {isApplied && (
          <Button disabled className="bg-gray-600 rounded-lg">
            Already Applied
          </Button>
        )}
      </div>

      <div className="my-10">
        <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
          Job Description
        </h1>
        <div className="my-4">
          <h1 className="font-bold my-1">
            Role:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.title}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Location:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.location}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Description:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.description}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Experience:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.experience} years
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Salary:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.salary} LPA
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Total Applicants:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.applications?.length}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Posted Date:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.createdAt?.split("T")[0]}
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
