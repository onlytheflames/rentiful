"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const DiscoverSection = () => {
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
    <div ref={containerRef} className="mb-16 bg-white py-12">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 xl:max-w-7xl xl:px-16">
        <div ref={titleRef} className="my-12 text-center">
          <h2 className="text-3xl font-semibold leading-tight text-gray-800">
            Discover
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Find your Dream Rental Property Today!
          </p>
          <p className="mx-auto mt-2 max-w-3xl text-gray-500">
            Searching for your dream rental property has never been easier. With
            Our user-friendly search feature, you can quickly find the perfect
            home that meets all your needs. Start your search today and discover
            your dream rental property!
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 lg:gap-12 xl:gap-16">
          {[
            {
              imageSrc: "/landing-icon-wand.png",
              title: "Search for properties",
              description:
                "Browse through our extensive collection of rental properties in your desired location.",
            },
            {
              imageSrc: "/landing-icon-calendar.png",
              title: "Book Your Rental",
              description:
                "Once you've found the perfect rental property, easily book it online with just a few clicks.",
            },
            {
              imageSrc: "/landing-icon-heart.png",
              title: "Enjoy your New Home",
              description:
                "Move into your new rental property and start enjoying your new home.",
            },
          ].map((card, index) => (
            <div key={index} ref={addToRefs}>
              {<DiscoverCard {...card} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DiscoverCard = ({
  title,
  imageSrc,
  description,
}: {
  imageSrc: string;
  title: string;
  description: string;
}) => (
  <div className="rounded-lg bg-primary-50 px-4 py-12 shadow-lg md:h-72">
    <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-primary-700 p-[0.6rem]">
      <Image
        src={imageSrc}
        width={30}
        height={30}
        className="h-full w-full"
        alt={title}
      />
    </div>
    <h3 className="mt-4 text-xl font-medium text-gray-800">{title}</h3>
    <p className="mt-2 text-base text-gray-600">{description}</p>
  </div>
);

export default DiscoverSection;
