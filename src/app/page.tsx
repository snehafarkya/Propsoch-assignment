import type { Metadata } from "next";
import DiscoveryMap from "@/components/discovery-map";
import { PropertyListing } from "@/data/property-listing";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, concatenateTypologies } from "@/utils/helpers";
import heroImg from "../assets/heroimg.png";
import PropertyGrid from "@/components/propertyGrid";
import InfiniteHorizontalScroll from "@/components/infiniteScroll";
import Pagination from "@/components/pagination";
/* --------------------------------------------
   METADATA
---------------------------------------------*/
export const metadata: Metadata = {
  title: "Discover Properties | Propsoch Assignment",
  description:
    "Explore real estate projects with map and list views. Browse properties with pagination and detailed insights.",
};

/* --------------------------------------------
   CONFIG
---------------------------------------------*/
const PAGE_SIZE = 6;

/* --------------------------------------------
   SAFE PAGE PARSER
---------------------------------------------*/
function parsePage(value: unknown): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

/* --------------------------------------------
   PAGE (SSR + ASYNC searchParams)
---------------------------------------------*/
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // ✅ MUST await searchParams (NEW RULE)
  const resolvedSearchParams = await searchParams;

  const rawPage = resolvedSearchParams.page;
  const pageValue = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const currentPage = parsePage(pageValue);

  const totalItems = PropertyListing.projects.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const safePage = currentPage > totalPages ? totalPages : currentPage;

  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const paginatedProjects = PropertyListing.projects.slice(
    startIndex,
    endIndex
  );

  return (
    <div className="min-h-screen text-black w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 flex flex-col gap-10 py-6">
        {/* LIST VIEW */}
        <section className="flex flex-col gap-6">
          <div className="flex md:flex-row flex-col justify-center  mt-6 items-center ">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-center text-purple-600">
                Property Listings
              </h1>
              <p className=" font-medium text-gray-600 pt-2 max-w-xl">
                Discover premium residential properties in Bengalurus most
                sought-after neighborhoods
              </p>
              {/* <Link
                href={"#list"}
                className="bg-white text-purple-600 px-4 py-2 border rounded-lg cursor-pointer hover:bg-purple-50 border-purple-500 transform transition-transform font-medium text-base "
              >
                View here
              </Link> */}
            </div>

            {/* <Image className=" drop-shadow-2xl " src={heroImg} alt="Image" /> */}
          </div>
          {/* <div className="max-w-7xl mx-auto">
            <InfiniteHorizontalScroll />
          </div> */}
          <PropertyGrid properties={paginatedProjects} />
        </section>

        {/* PAGINATION */}
        <Pagination
  currentPage={safePage}
  totalPages={totalPages}
  basePath="/"
  maxVisiblePages={6}
/>
<div className="max-w-7xl mx-auto">
            <InfiniteHorizontalScroll />
          </div>

        {/* MAP VIEW */}
        <div className="h-[60vh] w-full rounded-lg overflow-hidden">
        <DiscoveryMap allFilteredData={PropertyListing} />
      </div>
      </div>
    </div>
  );
}
