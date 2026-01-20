import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  maxVisiblePages?: number;
  query?: Record<string, string | number | undefined>;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  maxVisiblePages = 5,
  query = {},
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

  const buildHref = (page: number) => ({
    pathname: basePath,
    query: { ...query, page },
  });

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      {/* PREVIOUS */}
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`rounded-md border px-3 py-2 text-sm transition ${
          currentPage === 1
            ? "pointer-events-none opacity-40"
            : "bg-white hover:bg-gray-100"
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
            href={buildHref(page)}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-md px-4 py-2 text-sm transition ${
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
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`rounded-md border px-3 py-2 text-sm transition ${
          currentPage === totalPages
            ? "pointer-events-none opacity-40"
            : "bg-white hover:bg-gray-100"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
