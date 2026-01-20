import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  maxVisiblePages?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = "/",
  maxVisiblePages = 6,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const half = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(1, currentPage - half);
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const createHref = (page: number) => ({
    pathname: basePath,
    query: { page },
  });

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      {/* PREVIOUS */}
      <Link
        href={createHref(currentPage - 1)}
        aria-disabled={currentPage === 1}
        className={`px-3 py-2 rounded-md border text-sm transition ${
          currentPage === 1
            ? "pointer-events-none opacity-40"
            : "bg-black text-white hover:bg-gray-100 hover:text-black"
        }`}
      >
        Prev
      </Link>

      {/* PAGE NUMBERS */}
      {pages.map((page) => {
        const isActive = page === currentPage;

        return (
          <Link
            key={page}
            href={createHref(page)}
            aria-current={isActive ? "page" : undefined}
            className={`px-4 py-2 rounded-md border text-sm transition ${
              isActive
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {page}
          </Link>
        );
      })}

      {/* NEXT */}
      <Link
        href={createHref(currentPage + 1)}
        aria-disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-md border text-sm transition ${
          currentPage === totalPages
            ? "pointer-events-none opacity-40"
            : "bg-black text-white hover:bg-gray-100 hover:text-black"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
