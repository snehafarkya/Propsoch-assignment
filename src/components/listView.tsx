import Image from "next/image";
import Link from "next/link";
import { formatPrice, concatenateTypologies } from "@/utils/helpers";
import { projectListing } from "@/types/types";

interface PropertyListProps {
  properties: projectListing[];
}

export default function PropertyList({
  properties,
}: PropertyListProps) {
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
        <div
          key={property.id}
          className="relative flex flex-col hover:shadow-sm sm:flex-row gap-4 p-4 first:rounded-t-2xl last:rounded-b-2xl hover:bg-purple-50/40 transition"
        >
          {/* IMAGE */}
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

          {/* CONTENT */}
          <div className="flex flex-1 flex-col justify-between gap-2">
            <div className="flex justify-between items-start">
              <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {property.name}
              </h3>

              <p className="text-sm text-gray-600">
                {property.micromarket}, {property.city}
              </p>
              </div>
               <p className="text-purple-600 font-bold absolute top-4 right-4 text-md">
                {formatPrice(property.minPrice, false)} –{" "}
                {formatPrice(property.maxPrice, false)} INR
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
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center sm:items-end">
            <Link
              href={`/property-for-sale-in/${property.city.toLowerCase()}/${property.slug}/${property.id}`}
              className="rounded-lg border border-purple-600 px-4 py-2 text-sm font-medium text-purple-600 transition hover:bg-purple-600 hover:text-white"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
