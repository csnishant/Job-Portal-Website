import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Contact, Mail, Pen } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const isResume = true;

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Profile Info Card */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl my-6 px-4 py-6 sm:px-8 sm:py-10">
        {/* Top Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Avatar + Info */}
          <div className="flex items-center gap-4">
            <Avatar className=" h-20  w-20 sm:h-24 sm:w-24">
              <AvatarImage  className="object-cover" src={user?.profile?.profilePhoto} />
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {user?.fullname}
              </h1>
              <p className="text-gray-600 text-sm">{user?.profile?.bio}</p>
            </div>
          </div>

          {/* Edit Button */}
          <div className="self-end sm:self-auto">
            <Button onClick={() => setOpen(true)} variant="outline" size="sm">
              <Pen className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 space-y-4 text-sm text-gray-700">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-500" />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Contact className="w-4 h-4 text-gray-500" />
            <span>{user?.phoneNumber}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h2 className="font-semibold text-gray-800 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user?.profile?.skills?.length > 0 ? (
              user?.profile.skills.map((skill, index) => (
                <Badge key={index}>{skill}</Badge>
              ))
            ) : (
              <span className="text-gray-500">No skills added</span>
            )}
          </div>
        </div>

        {/* Resume */}
        <div className="mt-6">
          <Label className="text-sm font-semibold text-gray-700 mb-1 block">
            Resume
          </Label>
          {isResume && user?.profile?.resume ? (
            <a
              className="text-blue-600 hover:underline text-sm break-all"
              href={user?.profile?.resume}
              target="_blank"
              rel="noopener noreferrer">
              {user?.profile?.resumeOriginalName || "Download Resume"}
            </a>
          ) : (
            <span className="text-gray-500 text-sm">No resume uploaded</span>
          )}
        </div>
      </div>

      {/* Applied Jobs Section */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl px-4 py-6 sm:px-8 sm:py-10 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Applied Jobs
        </h2>
        <AppliedJobTable />
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
