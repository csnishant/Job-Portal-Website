import React from "react";
import { Badge } from "./ui/badge";
import { CheckCircle2, XCircle, Lightbulb, Target } from "lucide-react";

const AIAnalysisReport = ({ data }) => {
  if (!data) return null;

  const { score, matchedKeywords, missingKeywords, tip } = data;

  return (
    <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <Target className="text-violet-600" />
        <h2 className="font-bold text-xl text-gray-800">
          AI Compatibility Report
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Score Circle */}
        <div className="flex flex-col items-center justify-center p-4 bg-violet-50 rounded-lg">
          <div className="relative flex items-center justify-center">
            <svg className="w-24 h-24">
              <circle
                className="text-gray-200"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="48"
                cy="48"
              />
              <circle
                className={score >= 70 ? "text-green-500" : "text-violet-600"}
                strokeWidth="5"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * score) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="48"
                cy="48"
              />
            </svg>
            <span className="absolute text-xl font-bold">{score}%</span>
          </div>
          <p className="mt-2 text-sm font-medium text-gray-600">Match Score</p>
        </div>

        {/* Middle: Skills Analysis */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-1 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> Matched
              Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {matchedKeywords?.map((skill, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                  {skill}
                </Badge>
              ))}
              {matchedKeywords?.length === 0 && (
                <span className="text-xs text-gray-400">
                  No direct matches found.
                </span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-1 mb-2">
              <XCircle className="w-4 h-4 text-red-500" /> Improvement Areas
              (Missing)
            </h3>
            <div className="flex flex-wrap gap-2">
              {missingKeywords?.map((skill, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-red-600 border-red-200 bg-red-50">
                  {skill}
                </Badge>
              ))}
              {missingKeywords?.length === 0 && (
                <span className="text-xs text-gray-400">
                  Your resume covers all key requirements!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: AI Advice */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-3">
        <Lightbulb className="text-amber-600 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-amber-800">
            AI Recommendation
          </h4>
          <p className="text-sm text-amber-700 mt-1">
            {tip ||
              (score < 50
                ? "Consider tailoring your resume summary and projects to highlight the missing skills mentioned above."
                : "Your profile is strong! Double check your contact details before applying.")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisReport;
