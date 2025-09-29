import React from "react";
import Button from "./UI/Button";

interface PaginationProps {
  paginationData: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  paginationData,
  setCurrentPage,
}) => {
  const { currentPage, totalPages } = paginationData;

  return (
    <div className="flex justify-end space-x-2 mt-4">
      <Button
        size="sm"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
      >
        Previous
      </Button>

      <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
        {currentPage} / {totalPages || 1}
      </span>

      <Button
        size="sm"
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
