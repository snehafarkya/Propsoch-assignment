import type { Metadata } from "next";
import { PropertyListing } from "@/data/property-listing";
import PropertyList from "@/components/listView";
import PropertyGrid from "@/components/propertyGrid";
import Pagination from "@/components/pagination";
import InfiniteHorizontalScroll from "@/components/infiniteScroll";
import DiscoveryMapClient from "@/components/dicovery-map-client";

export const metadata: Metadata = {
  title: "Discover Properties in Bangalore | Real Estate Listings",
  description:
    "Browse residential properties in Bangalore with interactive map view, filters, and pagination.",

  metadataBase: new URL("https://propsoch-assignmentt.vercel.app/"), 

  openGraph: {
    title: "Discover Properties in Bangalore",
    description:
      "Explore residential properties in Bangalore using an interactive map and detailed listings.",
    url: "https://propsoch-assignmentt.vercel.app/",
    siteName: "Property Discovery",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "Property discovery map view",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Discover Properties in Bangalore",
    description:
      "Browse residential properties with map-based discovery and rich details.",
    images: ["/hero.png"],
  },

};


const PAGE_SIZE = 6;
// async function to simulate fetching paginated data
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(Number(page) || 1, 1);

  const totalItems = PropertyListing.projects.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProjects = PropertyListing.projects.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  return (
    <main className="min-h-screen w-full bg-gray-50 text-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6">
        <header className="flex flex-col gap-1 ">
          <h1 className="text-4xl font-bold text-purple-600">
            Property Listings
          </h1>
          <p className="max-w-xl text-gray-600">
            Discover premium residential properties in Bangalore, all at one place.
          </p>
        </header>

        {/* LIST VIEW for tablet and more*/}
        <section>
          <div className="hidden md:block">
            <PropertyList properties={paginatedProjects} />
          </div>
        {/* GRID VIEW for mobile*/}
          <div className="block md:hidden">
            <PropertyGrid properties={paginatedProjects} />
          </div>
        </section>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/"
            maxVisiblePages={4}
          />
        )}
        <InfiniteHorizontalScroll />
        {/* MAP VIEW */}
          <h1 className="text-4xl font-bold text-purple-600">
            Property Map
          </h1>
        <section className="w-full overflow-hidden rounded-lg">
          <DiscoveryMapClient allFilteredData={PropertyListing} />
        </section>
      </div>
    </main>
  );
}
