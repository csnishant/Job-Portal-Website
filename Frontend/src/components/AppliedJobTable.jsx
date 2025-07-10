import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  if (!allAppliedJobs || allAppliedJobs.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-sm">
        You haven't applied to any job yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-sm">
      <Table className="min-w-[600px]">
        <TableCaption className="text-gray-500 py-2 text-sm">
          A list of your applied jobs
        </TableCaption>

        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="text-gray-700 text-sm">Date</TableHead>
            <TableHead className="text-gray-700 text-sm">Job Role</TableHead>
            <TableHead className="text-gray-700 text-sm">Company</TableHead>
            <TableHead className="text-right text-gray-700 text-sm">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allAppliedJobs.map((appliedJob) => (
            <TableRow key={appliedJob._id} className="hover:bg-gray-50">
              <TableCell className="text-sm text-gray-800">
                {appliedJob?.createdAt?.split("T")[0]}
              </TableCell>
              <TableCell className="text-sm text-gray-800">
                {appliedJob?.job?.title}
              </TableCell>
              <TableCell className="text-sm text-gray-800">
                {appliedJob?.job?.company?.name}
              </TableCell>
              <TableCell className="text-right">
                <Badge
                  className={`text-white text-xs px-3 py-1 rounded-full ${
                    appliedJob.status === "rejected"
                      ? "bg-red-500"
                      : appliedJob.status === "pending"
                      ? "bg-gray-400"
                      : "bg-green-500"
                  }`}>
                  {appliedJob.status.toUpperCase()}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
