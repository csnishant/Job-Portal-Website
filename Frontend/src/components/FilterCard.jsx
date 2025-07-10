import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { Button } from "./ui/button";
import { Filter, XCircle, ChevronDown, ChevronUp } from "lucide-react";

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "FullStack Developer",
      "CEO",
    ],
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh", "Fulltime"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);

  const toggleSection = (type) => {
    setOpenSection(openSection === type ? null : type);
  };

  const handleReset = () => {
    setSelectedValue("");
    setOpenSection(null);
    setShowFilter(false);
  };

  return (
    <div className="w-full">
      {/* Top Filter Button */}
      <div className="flex justify-between items-center px-4 py-3 border rounded-lg shadow-sm bg-white sticky top-16 z-30">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-black">
          <Filter size={18} />
          Filter
        </button>

        {selectedValue && (
          <Button
            variant="outline"
            className="flex items-center gap-2 text-red-500 border-red-400 hover:bg-red-50"
            onClick={handleReset}>
            <XCircle size={18} />
            Reset
          </Button>
        )}
      </div>

      {/* Dropdown Panel */}
      {showFilter && (
        <div className="bg-white mt-2 rounded-lg shadow p-4 transition-all">
          {filterData.map((section, index) => (
            <div key={index} className="mb-4 border-b pb-2">
              {/* Accordion Header */}
              <div
                className="flex justify-between items-center cursor-pointer mb-2"
                onClick={() => toggleSection(section.filterType)}>
                <h3 className="font-semibold text-gray-700">
                  {section.filterType}
                </h3>
                {openSection === section.filterType ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </div>

              {/* Accordion Content */}
              {openSection === section.filterType && (
                <div className="flex flex-wrap gap-3 transition-all">
                  {section.array.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        setSelectedValue(item === selectedValue ? "" : item)
                      }
                      className={`px-4 py-2 text-sm rounded-full border whitespace-nowrap transition-all
                        ${
                          selectedValue === item
                            ? "bg-gradient-to-br from-pink-500 to-red-500 text-white shadow"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                        }`}>
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterCard;
