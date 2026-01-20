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

  const windowRadius = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(1, currentPage - windowRadius);
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

  const navButtonClass = (disabled: boolean) =>
    `rounded-md border px-3 py-2 text-sm transition ${
      disabled
        ? "pointer-events-none opacity-40"
        : "bg-white hover:bg-gray-100"
    }`;

  const pageButtonClass = (active: boolean) =>
    `rounded-md px-4 py-2 text-sm transition ${
      active ? "bg-black text-white" : "bg-white hover:bg-gray-100"
    }`;

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      {/* PREVIOUS */}
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : 0}
        className={navButtonClass(currentPage === 1)}
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
            className={pageButtonClass(isActive)}
          >
            {page}
          </Link>
        );
      })}

      {/* NEXT */}
      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : 0}
        className={navButtonClass(currentPage === totalPages)}
      >
        Next
      </Link>
    </nav>
  );
}
