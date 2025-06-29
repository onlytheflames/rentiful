"use client";

import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const slideUp = useRef(null);

  useGSAP(
    () => {
      gsap.from(slideUp.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
      });
    },
    { dependencies: [] },
  );

  return (
    <div className="relative h-screen">
      <Image
        src="/landing-splash.jpg"
        alt="Rentiful Rental Platform Hero Section"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />
      <div
        ref={slideUp}
        className="absolute left-1/2 top-1/3 w-full -translate-x-1/2 -translate-y-1/2 transform text-center"
      >
        <div className="mx-auto max-w-4xl px-16 sm:px-12">
          <h1 className="mb-4 text-5xl font-bold text-white">
            Start your journey to finding the perfect place to call home
          </h1>
          <p className="mb-8 text-xl text-white">
            Explore our wide range of rental properties tailored to fit your
            lifestyle and needs!
          </p>

          <div className="flex justify-center">
            <Input
              type="text"
              value="search query"
              onChange={() => {}}
              placeholder="Search by city, neighborhood or address"
              className="h-12 w-full max-w-lg rounded-none rounded-l-xl border-none bg-white"
            />
            <Button
              onClick={() => {}}
              className="h-12 rounded-none rounded-r-xl border-none bg-secondary-500 text-white hover:bg-secondary-600"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
