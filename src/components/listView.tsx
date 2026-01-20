import Image from "next/image";
import Link from "next/link";
import {
  formatPrice,
  concatenateTypologies,
  formatDate,
} from "@/utils/helpers";
import { projectListing } from "@/types/types";
import { PropscoreRating } from "@/assets/PropsochRating";
import { BudgetIcon } from "@/assets/budget-icon";
import { LocationIcon } from "@/assets/location-icon";

interface PropertyListProps {
  properties: projectListing[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  return (
    <div
      id="list"
      className="flex flex-col divide-y rounded-2xl border border-gray-300  divide-gray-100 bg-white"
    >
      {properties.length === 0 && (
        <p className="p-6 text-center text-sm text-gray-500">
          No properties found.
        </p>
      )}

      {properties.map((property) => (
        <Link
          key={property.id}
          href={`/property-for-sale-in/${property.city.toLowerCase()}/${
            property.slug
          }/${property.id}`}
          className="relative group first:rounded-t-2xl last:rounded-b-2xl flex flex-col hover:shadow-sm sm:flex-row gap-4 p-4 hover:bg-purple-50/40 transition"
        >
            <div className="relative h-40 sm:h-28 sm:w-44 w-full shrink-0 overflow-hidden rounded-xl">
              <Image
                src={property.image}
                alt={property.alt}
                fill
                className="object-cover"
              />

              <span className="absolute top-3 left-3 rounded-full bg-white px-2 py-1 text-xs font-medium capitalize shadow">
                {property.projectStatus}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between gap-2">
              <div className="flex gap-2 items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {property.name}
                  </h3>

                  <p className="text-sm text-gray-600">
                    <LocationIcon
                      width={16}
                      height={16}
                      className="inline-block mr-1 text-gray-500"
                    />
                    {property.micromarket}, {property.city}
                  </p>
                </div>
                <PropscoreRating
                  rating={property.propscore}
                  width={100}
                  height={22}
                />
                <p className="text-purple-600 flex items-center font-bold absolute top-4 right-4 text-md">
                  <BudgetIcon
                    width={22}
                    height={22}
                    color="oklch(55.8% 0.288 302.321)"
                    className="inline-block"
                  />
                  {formatPrice(property.minPrice, false)} –{" "}
                  {formatPrice(property.maxPrice, false)}
                </p>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <p className="text-gray-700">
                  <span className="text-gray-500">Type:</span>{" "}
                  {concatenateTypologies(property.typologies)}
                </p>

                <p className="text-gray-700">
                  <span className="text-gray-500">Builder:</span>{" "}
                  {property.developerName}
                </p>
                <span className="flex text-gray-700 items-center gap-1">
                  <span className="text-gray-500">Date:</span>{" "}
                  {formatDate(property.possessionDate)}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center sm:items-end">
              <button className="rounded-lg border border-purple-600 px-4 py-2 text-sm font-medium text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white">
                View Details
              </button>
            </div>
        </Link>
      ))}
    </div>
  );
}
