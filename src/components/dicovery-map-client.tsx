"use client";

//built this component to render map on client side. This avoids SSR issues with leaflet. 
import dynamic from "next/dynamic";
import { projectListing } from "@/types/types";

const DiscoveryMap = dynamic(
  () => import("./discovery-map"),
  { ssr: false }
);

export default function DiscoveryMapClient({
  allFilteredData,
}: {
  allFilteredData: { projects: projectListing[] };
}) {
  return <DiscoveryMap allFilteredData={allFilteredData} />;
}
