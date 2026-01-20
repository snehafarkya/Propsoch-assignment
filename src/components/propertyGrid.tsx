import Image from "next/image";
import Link from "next/link";
import { formatPrice, concatenateTypologies } from "@/utils/helpers";
import { projectListing } from "@/types/types";

interface PropertyGridProps {
  properties: projectListing[];
}

export default function PropertyGrid({
  properties,
}: PropertyGridProps) {
  return (
    <div
      id="list"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-content-center place-items-center gap-10"
    >
      {properties.map((property) => (
        <div
          key={property.id}
          className="group rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 md:w-96"
        >
          {/* Image wrapper */}
          <div className="relative h-48 overflow-hidden rounded-t-xl">
            <Image
              src={property.image}
              alt={property.alt}
              width={400}
              height={250}
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
            />

            {/* Status badge */}
            <span className="absolute top-4 left-4 rounded-full bg-white px-2 py-1 text-sm font-medium capitalize">
              {property.projectStatus}
            </span>
          </div>

          {/* Content */}
          <div className="relative flex flex-col gap-2 p-4">
            <h3 className="border-b border-gray-200 pb-4 text-lg font-semibold sm:text-xl line-clamp-2">
              {property.name}
              <p className="mt-1 text-sm font-normal text-gray-600">
                {property.micromarket}, {property.city}
              </p>
            </h3>

            <p className="text-sm text-gray-500">
              Price Range:{" "}
              <span className="font-medium">
                {formatPrice(property.minPrice, false)} –{" "}
                {formatPrice(property.maxPrice, false)}
              </span>
            </p>

            <p className="truncate text-sm text-gray-500">
              Property type:{" "}
              <span className="font-medium">
                {concatenateTypologies(property.typologies)}
              </span>
            </p>

            {/* Info grid */}
            <div className="grid grid-cols-3 rounded-xl bg-gray-100 p-2 text-sm">
              <div className="flex flex-col items-center gap-1">
                <p className="text-gray-500">Area</p>
                <p className="text-purple-600">
                  {property.landArea}
                </p>
              </div>

              <div className="flex flex-col items-center gap-1">
                <p className="text-gray-500">Builder</p>
                <p className="line-clamp-1 text-purple-600">
                  {property.developerName}
                </p>
              </div>

              <div className="flex flex-col items-center gap-1">
                <p className="text-gray-500">Type</p>
                <p className="text-purple-600">
                  {property.type}
                </p>
              </div>
            </div>

            {/* CTA */}
            <Link
              href={`/property-for-sale-in/${property.city.toLowerCase()}/${property.slug}/${property.id}`}
              className="absolute right-4 top-4 rounded-lg px-2 py-1 text-sm font-medium text-purple-600 transition group-hover:bg-purple-50"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
