import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AmenityIcons, HighlightIcons } from "@/lib/constants";
import { formatEnumString } from "@/lib/utils";
import { useGetPropertyQuery } from "@/state/api";
import { HelpCircle } from "lucide-react";
import React from "react";

const PropertyDetails = ({ propertyId }: PropertyDetailsProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  if (isLoading) return <>Loading...</>;
  if (isError || !property) {
    return <>Property not Found</>;
  }

  return (
    <div className="mb-6">
      {/* Amenities */}
      <div>
        <h2 className="my-3 text-xl font-semibold">Property Amenities</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {property.amenities.map((amenity: AmenityEnum) => {
            const Icon = AmenityIcons[amenity as AmenityEnum] || HelpCircle;
            return (
              <div
                key={amenity}
                className="flex flex-col items-center rounded-xl border px-4 py-8"
              >
                <Icon className="mb-2 h-8 w-8 text-gray-700" />
                <span className="text-center text-sm text-gray-700">
                  {formatEnumString(amenity)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlights */}
      <div className="mb-16 mt-12">
        <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">
          Highlights
        </h3>
        <div className="mt-4 grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {property.highlights.map((highlight: HighlightEnum) => {
            const Icon =
              HighlightIcons[highlight as HighlightEnum] || HelpCircle;
            return (
              <div
                key={highlight}
                className="flex flex-col items-center rounded-xl border px-4 py-8"
              >
                <Icon className="mb-2 h-8 w-8 text-primary-600 dark:text-primary-300" />
                <span className="text-center text-sm text-primary-600 dark:text-primary-300">
                  {formatEnumString(highlight)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs Section */}
      <div>
        <h3 className="mb-5 text-xl font-semibold text-primary-800 dark:text-primary-100">
          Fees and Policies
        </h3>
        <p className="mt-2 text-sm text-primary-600 dark:text-primary-300">
          The fees below are based on community-supplied data and may exclude
          additional fees and utilities.
        </p>
        <Tabs defaultValue="required-fees" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="required-fees">Required Fees</TabsTrigger>
            <TabsTrigger value="pets">Pets</TabsTrigger>
            <TabsTrigger value="parking">Parking</TabsTrigger>
          </TabsList>
          <TabsContent value="required-fees" className="w-1/3">
            <p className="mb-2 mt-5 font-semibold">One time move in fees</p>
            <hr />
            <div className="flex justify-between bg-secondary-50 py-2">
              <span className="font-medium text-primary-700">
                Application Fee
              </span>
              <span className="text-primary-700">
                ${property.applicationFee}
              </span>
            </div>
            <hr />
            <div className="flex justify-between bg-secondary-50 py-2">
              <span className="font-medium text-primary-700">
                Security Deposit
              </span>
              <span className="text-primary-700">
                ${property.securityDeposit}
              </span>
            </div>
            <hr />
          </TabsContent>
          <TabsContent value="pets">
            <p className="mb-2 mt-5 font-semibold">
              Pets are {property.isPetsAllowed ? "allowed" : "not allowed"}
            </p>
          </TabsContent>
          <TabsContent value="parking">
            <p className="mb-2 mt-5 font-semibold">
              Parking is{" "}
              {property.isParkingIncluded ? "included" : "not included"}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertyDetails;
