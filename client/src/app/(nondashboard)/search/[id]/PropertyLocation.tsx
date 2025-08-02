import { useGetPropertyQuery } from "@/state/api";
import { Compass, MapPin } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const PropertyLocation = ({ propertyId }: PropertyDetailsProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (isLoading || isError || !property) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mirachi/cmdnv10vy00c601s87orn3e2g",
      center: [
        property.location.coordinates.longitude,
        property.location.coordinates.latitude,
      ],
      zoom: 14,
    });

    const marker = new mapboxgl.Marker()
      .setLngLat([
        property.location.coordinates.longitude,
        property.location.coordinates.latitude,
      ])
      .addTo(map);

    const markerElement = marker.getElement();
    const path = markerElement.querySelector("path[fill='#3FB1CE']");
    if (path) path.setAttribute("fill", "#000000");

    return () => map.remove();
  }, [property, isError, isLoading]);

  if (isLoading) return <>Loading...</>;
  if (isError || !property) {
    return <>Property not Found</>;
  }

  return (
    <div className="py-16">
      <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">
        Map and Location
      </h3>
      <div className="mt-2 flex items-center justify-between text-sm text-primary-500">
        <div className="flex items-center text-gray-500">
          <MapPin className="mr-1 h-4 w-4 text-gray-700" />
          Property Address:
          <span className="ml-2 font-semibold text-gray-700">
            {property.location?.address || "Address not available"}
          </span>
        </div>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(
            property.location?.address || "",
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 text-primary-600 hover:underline"
        >
          <Compass className="h-5 w-5" />
          Get Directions
        </a>
      </div>
      <div
        className="relative mt-4 h-[300px] overflow-hidden rounded-lg"
        ref={mapContainerRef}
      />
    </div>
  );
};

export default PropertyLocation;
