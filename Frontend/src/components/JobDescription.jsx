import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT, USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import {
  Loader2,
  Calendar,
  MapPin,
  Briefcase,
  IndianRupee,
  Users,
} from "lucide-react";
import AIAnalysisReport from "./AIAnalysisReport"; // Import the component
import { setUser } from "@/redux/authSlice";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isInitiallyApplied =
    singleJob?.applications?.some(
      (app) => app.applicant === user?._id || app === user?._id,
    ) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const [atsData, setAtsData] = useState(null);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

const checkATSHandler = async () => {
  // Validation: Check agar file hai ya profile me resume hai
  if (!resume && !user?.profile?.resume) {
    toast.error("Please upload a resume or update your profile.");
    return;
  }

  try {
    setLoading(true);

    // --- STEP 1: Agar Naya Resume select kiya hai, pehle use update karein ---
    if (resume) {
      const updateFormData = new FormData();
      updateFormData.append("resume", resume);

      const updateRes = await axios.post(
        `${USER_API_END_POINT}/update-resume`, // Aapka naya seprate endpoint
        updateFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      if (updateRes.data.success) {
        // Redux update karein taaki UI sync ho jaye
        dispatch(setUser(updateRes.data.user));
        toast.success("Resume updated to profile!");
      }
    }

    // --- STEP 2: ATS Check API call karein ---
    // Ab hum backend ko bata rahe hain ki profile se data uthaye (Empty body)
    const res = await axios.post(
      `${APPLICATION_API_END_POINT}/check-ats/${jobId}`,
      {}, // No data needed in body as it's now synced to profile
      { withCredentials: true },
    );

    if (res.data.success) {
      setAtsData(res.data.data);
      toast.success(`Analysis Complete: ${res.data.data.score}% Match`);
      setResume(null); // File input clear karne ke liye
    }
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Error checking ATS");
  } finally {
    setLoading(false);
  }
};

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {
          withCredentials: true,
        },
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
    <div className="max-w-7xl mx-auto my-10 px-5">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div>
            <h1 className="font-extrabold text-3xl text-gray-900">
              {singleJob?.title}
            </h1>
            <p className="text-violet-600 font-semibold text-lg mt-1">
              {singleJob?.company?.name}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-none px-4 py-1 rounded-full">
                {singleJob?.position} Positions
              </Badge>
              <Badge className="bg-red-50 text-red-600 hover:bg-red-50 border-none px-4 py-1 rounded-full">
                {singleJob?.jobType}
              </Badge>
              <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-none px-4 py-1 rounded-full">
                {singleJob?.salary} LPA
              </Badge>
            </div>
          </div>

          <div className="w-full md:w-auto">
            {!isApplied ? (
              <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase">
                  Apply with AI Assistant
                </p>

                {/* Show current resume name if it exists and no new file is chosen */}
                {user?.profile?.resume && !resume && (
                  <div className="text-xs text-violet-600 font-medium bg-violet-50 p-2 rounded border border-violet-100">
                    Using Profile:{" "}
                    <span className="font-bold">
                      {user.profile.resumeOriginalName || "Current Resume"}
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResume(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-100 file:text-violet-700 hover:file:bg-violet-200"
                />

                <div className="flex gap-3">
                  <Button
                    onClick={checkATSHandler}
                    // Enable button if there is a new resume OR an existing profile resume
                    disabled={loading || (!resume && !user?.profile?.resume)}
                    variant="outline"
                    className="flex-1 border-violet-200 text-violet-700 hover:bg-violet-50">
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "AI Check"
                    )}
                  </Button>
                  {/* ... rest of your buttons */}
                </div>
              </div>
            ) : (
              <Button
                disabled
                className="w-full md:w-48 bg-gray-800 text-white rounded-xl py-6 cursor-not-allowed">
                Already Applied
              </Button>
            )}
          </div>
        </div>

        {/* AI Report Integration */}
        {atsData && <AIAnalysisReport data={atsData} />}

        <hr className="my-10 border-gray-100" />

        {/* Job Details Grid */}
        <div className="space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Briefcase size={20} className="text-gray-400" /> Job Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
              <IconDetail
                label="Location"
                value={singleJob?.location}
                icon={<MapPin size={18} />}
              />
              <IconDetail
                label="Experience"
                value={`${singleJob?.experienceLevel} Years`}
                icon={<Users size={18} />}
              />
              <IconDetail
                label="Annual Salary"
                value={`${singleJob?.salary} LPA`}
                icon={<IndianRupee size={18} />}
              />
              <IconDetail
                label="Employment Type"
                value={singleJob?.jobType}
                icon={<Briefcase size={18} />}
              />
              <IconDetail
                label="Applicants"
                value={singleJob?.applications?.length}
                icon={<Users size={18} />}
              />
              <IconDetail
                label="Posted On"
                value={singleJob?.createdAt?.split("T")[0]}
                icon={<Calendar size={18} />}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Role Description
            </h2>
            <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line">
              {singleJob?.description}
            </p>
          </div>

          {singleJob?.requirements?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Core Requirements
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {singleJob.requirements.map((req, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Clean Helper Component
const IconDetail = ({ label, value, icon }) => (
  <div className="flex items-start gap-3">
    <div className="text-gray-400 mt-1">{icon}</div>
    <div>
      <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">
        {label}
      </p>
      <p className="text-gray-800 font-medium">{value || "Not Specified"}</p>
    </div>
  </div>
);

export default JobDescription;
