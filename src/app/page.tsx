import type { Metadata } from "next";
import { PropertyListing } from "@/data/property-listing";
import PropertyList from "@/components/listView";
import Pagination from "@/components/pagination";
import PropertyGrid from "@/components/propertyGrid";
import InfiniteHorizontalScroll from "@/components/infiniteScroll";
import DiscoveryMap from "@/components/discovery-map";

/* --------------------------------------------
   METADATA
---------------------------------------------*/
export const metadata: Metadata = {
  title: "Discover Properties in Bangalore | Real Estate Listings",
  description:
    "Explore premium residential properties across Bangalore with search and pagination.",
};

/* --------------------------------------------
   CONFIG
---------------------------------------------*/
const PAGE_SIZE = 6;

/* --------------------------------------------
   UTILS
---------------------------------------------*/
function parsePage(value: unknown): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

/* --------------------------------------------
   PAGE (SSR)
---------------------------------------------*/
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Required in Next.js 16+
  const resolvedSearchParams = await searchParams;

  /* --------------------------------------------
     SEARCH PARAMS
  ---------------------------------------------*/
  const rawPage = resolvedSearchParams.page;
  const pageValue = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const currentPage = parsePage(pageValue);

  const searchQuery =
    typeof resolvedSearchParams.q === "string"
      ? resolvedSearchParams.q.toLowerCase()
      : "";

  /* --------------------------------------------
     FILTER (SEARCH ACROSS ALL LISTINGS)
  ---------------------------------------------*/
  const filteredProjects = PropertyListing.projects.filter((property) =>
    [
      property.name,
      property.city,
      property.micromarket,
      property.developerName,
      property.type,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery)
  );

  /* --------------------------------------------
     PAGINATION
  ---------------------------------------------*/
  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const safePage =
    totalPages === 0 ? 1 : currentPage > totalPages ? totalPages : currentPage;

  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  /* --------------------------------------------
     RENDER
  ---------------------------------------------*/
  return (
    <div className="min-h-screen w-full bg-gray-50 text-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6">
        {/* HEADER */}
        <section className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-4xl font-bold text-purple-600">
            Property Listings
          </h1>
          <p className="max-w-xl text-gray-600">
            Discover premium residential properties in Bangalore’s most
            sought-after neighborhoods.
          </p>
        </section>
        {/* SEARCH (SSR FORM) */}
        <form className=" flex w-full content-end md:ml-auto mx-auto max-w-sm gap-3">
          <input
            name="q"
            defaultValue={searchQuery}
            placeholder="Search by project, location, builder..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
          >
            Search
          </button>
        </form>
        {/* LIST VIEW */}
        <div className="hidden md:block">
          <PropertyList properties={paginatedProjects} />
        </div>
        <div className="md:hidden block">
          <PropertyGrid properties={paginatedProjects} />{" "}
        </div>
        {/* PAGINATION */}
        {totalPages > 1 && (
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            basePath="/"
            maxVisiblePages={4}
            query={{ q: searchQuery }}
          />
        )}
        <InfiniteHorizontalScroll />
        {/* MAP VIEW */}{" "}
        <div className="w-full rounded-lg overflow-hidden"> 
          <DiscoveryMap allFilteredData={PropertyListing} /> 
        </div>
      </div>
    </div>
  );
}
