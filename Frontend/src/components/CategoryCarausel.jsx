import React from "react";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const category = [
  "Frontend Developer",
  "Backend Developer",
  "Video Editor",
  "Senior Software Engineer",
  "Data Scientist",
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="w-full py-10 relative overflow-hidden">
      <h2 className="text-center text-2xl font-bold mb-6">
        Explore Job Categories
      </h2>

      <Carousel className="w-full max-w-4xl mx-auto relative">
        {/* Arrows - placed outside carousel items with safe padding */}
        <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10" />

        {/* Carousel Items - padded to stay between arrows */}
        <CarouselContent className="px-8 sm:px-10 md:px-14 gap-x-3 sm:gap-x-4">
          {category.map((cat, index) => (
            <CarouselItem
              key={index}
              className="basis-4/5 sm:basis-1/2 lg:basis-1/3">
              <Button
                onClick={() => searchJobHandler(cat)}
                className=" py-6 text-base font-medium text-white bg-gradient-to-br from-pink-400 to-red-600 hover:from-red-600 hover:to-pink-400 transition-all rounded-xl shadow">
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
