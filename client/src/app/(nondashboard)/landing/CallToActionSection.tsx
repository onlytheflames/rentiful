"use client";

import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/all";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const CallToActionSection = () => {
  const callToActionContainerRef = useRef(null);

  useGSAP(
    () => {
      gsap.from("#content-container", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        scrollTrigger: {
          trigger: "#content-container",
          start: "top 80%",
          once: true,
        },
      });
    },
    { dependencies: [], scope: callToActionContainerRef },
  );

  return (
    <div className="relative py-24" ref={callToActionContainerRef}>
      <Image
        src="/landing-call-to-action.jpg"
        alt="Rentiful Search Section Background"
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12 xl:max-w-6xl xl:px-16"
        id="content-container"
      >
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-6 md:mb-0 md:mr-10">
            <h2 className="text-2xl font-bold text-white">
              Find Your Dream Rental Property
            </h2>
          </div>
          <div>
            <p className="mb-3 text-white">
              Discover a wide range of rental properties in your desired
              location.
            </p>
            <div className="flex justify-center gap-4 md:justify-start">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-primary-700 hover:bg-primary-500 hover:text-primary-50"
              >
                Search
              </button>
              <Link
                href="/signup"
                className="inline-block rounded-lg bg-secondary-500 px-6 py-3 font-semibold text-white hover:bg-secondary-600"
                scroll={false}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToActionSection;
