"use client";

import ApplicationCard from "@/components/ApplicationCard";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetApplicationsQuery, useGetAuthUserQuery } from "@/state/api";
import { CircleCheckBig, Clock, Download, XCircle } from "lucide-react";
import React from "react";

const Applications = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: applications,
    isLoading,
    isError,
  } = useGetApplicationsQuery({
    userId: authUser?.cognitoInfo?.userId,
    userType: "tenant",
  });

  if (isLoading) return <Loading />;
  if (isError || !applications) return <div>Error fetching applications</div>;

  return (
    <div className="dashboard-container">
      <Header
        title="Applications"
        subtitle="Track and manage your property rental applications"
      />
      <div className="w-full">
        {applications?.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            userType="renter"
          >
            <div className="flex w-full justify-between gap-5 px-4 pb-4">
              {application.status === "Approved" ? (
                <div className="flex grow items-center bg-green-100 p-4 text-green-700">
                  <CircleCheckBig className="mr-2 h-5 w-5" />
                  The property is being rented by you until{" "}
                  {new Date(application.lease?.endDate).toLocaleDateString()}
                </div>
              ) : application.status === "Pending" ? (
                <div className="flex grow items-center bg-yellow-100 p-4 text-yellow-700">
                  <Clock className="mr-2 h-5 w-5" />
                  Your application is pending approval
                </div>
              ) : (
                <div className="flex grow items-center bg-red-100 p-4 text-red-700">
                  <XCircle className="mr-2 h-5 w-5" />
                  Your application has been denied
                </div>
              )}

              <button
                className={`flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-primary-700 hover:text-primary-50`}
              >
                <Download className="mr-2 h-5 w-5" />
                Download Agreement
              </button>
            </div>
          </ApplicationCard>
        ))}
      </div>
    </div>
  );
};

export default Applications;
