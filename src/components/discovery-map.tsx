"use client";

import "leaflet/dist/leaflet.css";

import { JSX, useEffect, useMemo, useRef, useState } from "react";
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
import L, { Marker as LeafletMarker } from "leaflet";
import { renderToString } from "react-dom/server";

import { PropscoreRating } from "@/assets/PropsochRating";
import { BudgetIcon } from "@/assets/budget-icon";
import { HouseIcon } from "@/assets/house-icon";
import { LocationIcon } from "@/assets/location-icon";
import { CalendarIcon } from "@/assets/utility";
import { LandmarkIcon } from "@/assets/landmark-icon";
import { LandAreaIcon } from "@/assets/landIcon";

import {
  cn,
  concatenateTypologies,
  formatDate,
  formatPrice,
  para,
} from "@/utils/helpers";
import { projectListing } from "@/types/types";
import { Badge } from "./badge";


type MapLocation = {
  lat: number;
  lon: number;
  name: string;
};

/* --------------------------------------------
   ICON RENDERER
---------------------------------------------*/
const renderIcon = (
  icon: JSX.Element,
  ariaLabel: string,
  transform: string
) =>
  `<div style="transform:${transform}" aria-label="${ariaLabel}" role="button">
    ${renderToString(icon)}
  </div>`;

function getOtherLocationIcon(
  label: string,
  isSelected: boolean
): L.DivIcon {
  return L.divIcon({
    html: renderIcon(
      <div className="flex items-center gap-1">
        <LandmarkIcon
          width={16}
          height={16}
          color="#6B21A8"
          className="shrink-0"
        />
        <Badge
          variant="white"
          className={cn(
            "whitespace-nowrap text-sm font-semibold transition-all",
            isSelected 
          )}
        >
          {label}
        </Badge>
      </div>,
      label,
      "translate(-12px, -24px)"
    ),
    className: "custom-property-marker",
    iconAnchor: [0, 24],
    popupAnchor: [0, -28],
  });
}

/* --------------------------------------------
   MAP HELPERS
---------------------------------------------*/
function MapClickHandler({ onClick }: { onClick: () => void }) {
  useMapEvents({ click: onClick });
  return null;
}

function MapController({
  selectedLocation,
}: {
  selectedLocation: MapLocation | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.flyTo(
        [selectedLocation.lat, selectedLocation.lon],
        Math.max(map.getZoom(), 14),
        { duration: 1.2 }
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
  allFilteredData: { projects: projectListing[] };
}) {
  const [selectedLocation, setSelectedLocation] =
    useState<MapLocation | null>(null);

  const markerRefs = useRef<Record<string, LeafletMarker | null>>({});

  /* --------------------------------------------
     DERIVED PROPERTY (NO EFFECT!)
  ---------------------------------------------*/
  const selectedProperty = useMemo(() => {
    if (!selectedLocation) return null;

    return (
      allFilteredData.projects.find(
        (p) => p.name === selectedLocation.name
      ) ?? null
    );
  }, [selectedLocation, allFilteredData.projects]);

  /* --------------------------------------------
     OPEN POPUP WHEN PROPERTY CHANGES
  ---------------------------------------------*/
  useEffect(() => {
    if (selectedProperty) {
      markerRefs.current[selectedProperty.id]?.openPopup();
    }
  }, [selectedProperty]);

  return (
    <section className="h-screen w-screen">
      <MapContainer
        center={[12.97, 77.59]}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full rounded-lg"
      >
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer checked name="Street View">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
        </LayersControl>

        <MapClickHandler onClick={() => setSelectedLocation(null)} />
        <MapController selectedLocation={selectedLocation} />

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={60}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
        >
          {allFilteredData.projects.map((project) => (
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
                minWidth={380}
                offset={[0, -20]}
                autoPan
                autoPanPadding={[40, 40]}
                keepInView
              >
                <Link
                  href={`/property-for-sale-in/${project.city.toLowerCase()}/${project.slug.toLowerCase()}/${project.id}`}
                  target="_blank"
                  className="block"
                >
                  <div className="flex gap-3 overflow-hidden text-gray-500 bg-white ">
                    {/* IMAGE */}
                    <div className="relative w-40 shrink-0">
                      <Image
                        src={project.image}
                        alt={project.alt}
                        fill
                        className={cn(
                          "object-cover",
                          project.projectStatus === "soldOut" && "grayscale"
                        )}
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-1  flex-col gap-2 ">
                      <h3 className="line-clamp-2 text-base text-black font-semibold">
                        {project.name}
                      </h3>

                      <div className="flex justify-between w-full gap-2 items-center text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <LocationIcon width={18} height={18} />
                          {project.micromarket}
                        </span>
                        <PropscoreRating
                          rating={project.propscore}
                          width={90}
                          height={20}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <span className="flex items-center gap-1">
                          <BudgetIcon width={18} height={18} />
                          {formatPrice(project.minPrice, false)} –{" "}
                          {formatPrice(project.maxPrice, false)}
                        </span>

                        <span className="flex items-center gap-1">
                          <HouseIcon width={18} height={18} />
                          {concatenateTypologies(project.typologies)}
                        </span>

                        <span className="flex items-center gap-1">
                          <CalendarIcon width={18} height={18} />
                          {formatDate(project.possessionDate)}
                        </span>

                        <span className="flex items-center gap-1">
                          <LandAreaIcon width={18} height={18} />
                          {project.minSaleableArea}–{project.maxSaleableArea} sqft
                        </span>
                      </div>

                      <div className="pt-2 text-right text-xs font-medium text-purple-600">
                        View Details →
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
