"use client";

import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const { data: authUser } = useGetAuthUserQuery();
  console.log(authUser);

  return (
    <div className="h-full w-full">
      <Navbar />
      <main
        className={`flex h-full w-full flex-col`}
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
