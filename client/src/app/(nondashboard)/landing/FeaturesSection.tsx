"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const FeaturesSection = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  // Function to add card refs
  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useGSAP(
    () => {
      // Create timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true, // Equivalent to viewport={{ once: true }}
        },
      });

      // Animate container (equivalent to containerVariants)
      tl.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
      );

      // Animate title (equivalent to itemVariants)
      tl.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.3", // Start 0.3s before previous animation ends
      );

      // Animate cards with stagger (equivalent to staggerChildren: 0.2)
      tl.fromTo(
        cardsRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.2, // Equivalent to staggerChildren
        },
        "-=0.3",
      );
    },
    { dependencies: [], scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="bg-white px-6 py-24 sm:px-8 lg:px-12 xl:px-16"
    >
      <div className="mx-auto max-w-4xl xl:max-w-6xl">
        <h2
          ref={titleRef}
          className="mx-auto mb-12 w-full text-center text-3xl font-bold sm:w-2/3"
        >
          Quickly find the home you want using our effective search filters!
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 xl:gap-16">
          {[0, 1, 2].map((index) => (
            // When you write ref={addToRefs}, React automatically calls that function and passes the DOM element as an argument. You don't need to manually pass anything.
            <div key={index} ref={addToRefs}>
              <FeatureCard
                imageSrc={`/landing-search${3 - index}.png`}
                title={
                  [
                    "Trustworthy and Verified Listings",
                    "Browse Rental Listings with Ease",
                    "Simplify Your Rental Search with Advanced",
                  ][index]
                }
                description={
                  [
                    "Discover the best rental options with user reviews and ratings.",
                    "Get access to user reviews and ratings for a better understanding of rental options.",
                    "Find trustworthy and verified rental listings to ensure a hassle-free experience.",
                  ][index]
                }
                linkText={["Explore", "Search", "Discover"][index]}
                linkHref={["/explore", "/search", "/discover"][index]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  imageSrc,
  title,
  description,
  linkText,
  linkHref,
}: {
  imageSrc: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}) => (
  <div className="text-center">
    <div className="mb-4 flex h-48 items-center justify-center rounded-lg p-4">
      <Image
        src={imageSrc}
        width={400}
        height={400}
        className="h-full w-full object-contain"
        alt={title}
      />
    </div>
    <h3 className="mb-2 text-xl font-semibold">{title}</h3>
    <p className="mb-4">{description}</p>
    <Link
      href={linkHref}
      className="inline-block rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
      scroll={false}
    >
      {linkText}
    </Link>
  </div>
);

export default FeaturesSection;
