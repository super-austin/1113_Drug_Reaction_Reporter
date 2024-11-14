import type { FC } from "react";
import { cva } from "class-variance-authority";

const paginationButton = cva("px-4 py-2 rounded transition-colors", {
  variants: {
    state: {
      active: "bg-blue-500 hover:bg-blue-600 text-white",
      disabled: "bg-gray-300 cursor-not-allowed text-gray-600",
    },
  },
  defaultVariants: {
    state: "active",
  },
});

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  isLoading: boolean;
  overallPages: number;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  onPageChange,
  hasNextPage,
  isLoading,
  overallPages,
}) => {
  return (
    <div className="flex justify-between items-center mt-6 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className={paginationButton({
          state: currentPage === 1 || isLoading ? "disabled" : "active",
        })}
      >
        Previous
      </button>
      <span className="text-gray-600">
        Page {currentPage} / {overallPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage || isLoading}
        className={paginationButton({
          state: !hasNextPage || isLoading ? "disabled" : "active",
        })}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
