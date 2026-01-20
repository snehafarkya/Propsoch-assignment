"use client";

import "leaflet/dist/leaflet.css";

import { JSX, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import MarkerClusterGroup from "react-leaflet-cluster";

import { PropscoreRating } from "@/assets/PropsochRating";
import {
  cn,
  concatenateTypologies,
  formatDate,
  formatPrice,
  para,
} from "@/utils/helpers";
import { BudgetIcon } from "@/assets/budget-icon";
import { HouseIcon } from "@/assets/house-icon";
import { LocationIcon } from "@/assets/location-icon";
import { CalendarIcon } from "@/assets/utility";
import L, { Marker as LeafletMarker } from "leaflet";
import { LocationType, projectListing } from "@/types/types";
import { Badge } from "./badge";
import { renderToString } from "react-dom/server";
import { LandmarkIcon } from "@/assets/landmark-icon";
import { Pin } from "@/assets/pin";
import { LandAreaIcon } from "@/assets/landIcon";

/* --------------------------------------------
   CLIENT-ONLY FIX FOR LEAFLET ICONS
---------------------------------------------*/
dynamic(() => import("leaflet-defaulticon-compatibility"), { ssr: false });

/* --------------------------------------------
   ICON RENDERER
---------------------------------------------*/
export const renderIcon = (
  icon: JSX.Element,
  ariaLabel: string,
  transform = "translate(-8px, -4px)"
) =>
  `<div style="transform:${transform}" aria-label="${ariaLabel}" role="button">
    ${renderToString(icon)}
  </div>`;

function getOtherLocationIcon(label: string, isSelected: boolean): L.DivIcon {
  return L.divIcon({
    html: renderIcon(
      <div className="flex items-baseline">
        <LandmarkIcon
          width={20}
          height={20}
          color="#6B21A8"
          className="shrink-0"
        />
        <Badge
          variant="white"
          className="w-max whitespace-nowrap text-base font-bold"
        >
          {label}
        </Badge>
      </div>,
      label,
      isSelected ? "translate(-10px, -20px)" : "translate(-15px, -20px)"
    ),
    className: "custom-property-marker",
  });
}


/* --------------------------------------------
   MAP HELPERS
---------------------------------------------*/
function MapClickHandler({ onClick }: { onClick: () => void }) {
  useMapEvents({
    click: onClick,
  });
  return null;
}

function MapController({
  selectedLocation,
}: {
  selectedLocation: LocationType | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.flyTo(
        [selectedLocation.lat, selectedLocation.lon],
        Math.max(map.getZoom(), 14),
        { duration: 1.5 }
      );
    }
  }, [selectedLocation, map]);

  return null;
}

/* --------------------------------------------
   MAIN COMPONENT
---------------------------------------------*/
export default function DiscoveryMap({
  allFilteredData,
}: {
  allFilteredData: any;
}) {
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(
    null
  );

  const [selectedProperty, setSelectedProperty] =
    useState<projectListing | null>(null);

  const markerRefs = useRef<Record<string, LeafletMarker | null>>({});

  /* --------------------------------------------
     SYNC PROPERTY WITH LOCATION
  ---------------------------------------------*/
  useEffect(() => {
    if (!selectedLocation) {
      setSelectedProperty(null);
      return;
    }

    const found = allFilteredData.projects.find(
      (p: projectListing) => p.name === selectedLocation.name
    );

    setSelectedProperty(found ?? null);
  }, [selectedLocation, allFilteredData.projects]);

  /* --------------------------------------------
     OPEN POPUP PROGRAMMATICALLY
  ---------------------------------------------*/
  useEffect(() => {
    if (selectedProperty) {
      const marker = markerRefs.current[selectedProperty.id];
      marker?.openPopup();
    }
  }, [selectedProperty]);

  return (
    <section className="flex h-screen flex-col overflow-hidden">
      <MapContainer
        center={[12.97, 77.59]}
        zoom={12}
        scrollWheelZoom
        className="z-10 size-full rounded-lg border"
      >
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer checked name="Street View">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="&copy; OpenStreetMap contributors"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <MapClickHandler onClick={() => setSelectedLocation(null)} />
        <MapController selectedLocation={selectedLocation} />

        {/* --------------------------------------------
            CLUSTERED MARKERS (ANTI-OVERLAP)
        ---------------------------------------------*/}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={60}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
        >
          {allFilteredData.projects.map((project: projectListing) => (
            <Marker
              key={project.id}
              position={[project.latitude, project.longitude]}
              icon={getOtherLocationIcon(
                project.name,
                selectedProperty?.id === project.id
              )}
              ref={(ref) => {
                markerRefs.current[project.id] = ref;
              }}
              eventHandlers={{
                click: () =>
                  setSelectedLocation({
                    lat: project.latitude,
                    lon: project.longitude,
                    name: project.name,
                  }),
              }}
            >
              <Popup
                maxWidth={400}
                maxHeight={200}
                offset={[0, -20]}
               
              >
                <Link
                  href={`/property-for-sale-in/${project.city.toLowerCase()}/${project.slug.toLowerCase()}/${
                    project.id
                  }`}
                  target="_blank"
                  className="block"
                >
                  <div className="flex h-full gap-2 overflow-hidden  bg-white ">
                    {/* IMAGE */}
                    <div className="relative w-40 shrink-0 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.alt}
                        fill
                        className={cn(
                          "object-cover",
                          project.projectStatus === "soldOut" && "grayscale"
                        )}
                      />

                      {project.projectStatus === "soldOut" && (
                        <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                          Sold Out
                        </span>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex gap-2 flex-col ">
                      {/* TOP */}
                      <div className="space-y-1">
                        <h3 className="line-clamp-2 text-xl font-semibold text-gray-900">
                          {project.name}
                        </h3>

                        <div className="flex items-center justify-between gap-4 w-full text-xs text-gray-600">
                          <span className="flex items-center gap-1 ">
                            <LocationIcon width={14} height={14} />
                            {project.micromarket}
                          </span>

                          <PropscoreRating
                            rating={project.propscore}
                            width={90}
                            height={20}
                          />
                        </div>
                      </div>

                      {/* MIDDLE */}
                      <div className=" text-xs grid grid-cols-2 gap-2 text-gray-700">
                        {/* <div className="flex justify-between gap-2"> */}
                          <span className="flex items-center gap-1">
                            <BudgetIcon width={14} height={14} />
                            {formatPrice(project.minPrice, false)} –{" "}
                            {formatPrice(project.maxPrice, false)}
                          </span>
                          <span className="flex items-center gap-1">
                            <HouseIcon width={14} height={14} />
                            {concatenateTypologies(project.typologies)}
                          </span>
                        {/* </div> */}

                        {/* <div className="flex justify-between gap-2"> */}
                          <span className="flex items-center gap-1">
                          <CalendarIcon width={14} height={14} />
                          {formatDate(project.possessionDate)}
                        </span>
                          <span className="flex items-center gap-1">
                            <LandAreaIcon width={14} height={14}/>
                             {project.minSaleableArea}–{project.maxSaleableArea}{" "}
                            sqft
                          </span>
                        {/* </div> */}
                      </div>

                      {/* BOTTOM */}
                      <div className="flex items-center justify-between border-t pt-2 text-xs text-gray-600">
                        

                        <span className="font-medium text-purple-600">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </section>
  );
}
