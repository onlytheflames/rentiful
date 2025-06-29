import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <div
      className="fixed left-0 top-0 z-50 w-full shadow-xl"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex w-full items-center justify-between bg-primary-700 px-8 py-3 text-white">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="group cursor-pointer" scroll={false}>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Rentiful Logo"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <div className="text-xl font-bold">
                <span className="group-hover:!text-primary-300">RENT</span>
                <span className="font-light text-secondary-500 group-hover:!text-primary-300">
                  IFUL
                </span>
              </div>
            </div>
          </Link>
        </div>

        <p className="hidden text-primary-200 md:block">
          Discover your perfect rental apartment with our advanced search
        </p>

        <div className="flex items-center gap-5">
          <Link href="/signin">
            <Button
              variant="outline"
              className="rounded-lg border-white bg-transparent text-white hover:bg-white hover:text-primary-700"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="secondary"
              className="rounded-lg bg-secondary-600 text-white hover:bg-white hover:text-primary-700"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
