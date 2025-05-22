import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { darkMode } = useContext(ThemeContext);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-8">
      <nav
        className={`inline-flex rounded-md shadow-sm -space-x-px ${
          darkMode ? "bg-gray-800" : ""
        }`}
        aria-label="Pagination"
      >
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium cursor-pointer ${
            currentPage === 1
              ? darkMode
                ? "text-gray-500 border-gray-700 bg-gray-800 cursor-not-allowed"
                : "text-gray-300 border-gray-300 bg-white cursor-not-allowed"
              : darkMode
              ? "text-gray-300 border-gray-700 bg-gray-800 hover:bg-gray-700"
              : "text-gray-500 border-gray-300 bg-white hover:bg-gray-50"
          }`}
        >
          &laquo; Anterior
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer ${
              currentPage === page
                ? darkMode
                  ? "z-10 bg-gray-700 border-gray-600 text-gray-200"
                  : "z-10 bg-gray-50 border-gray-500 text-gray-600"
                : darkMode
                ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium cursor-pointer ${
            currentPage === totalPages
              ? darkMode
                ? "text-gray-500 border-gray-700 bg-gray-800 cursor-not-allowed"
                : "text-gray-300 border-gray-300 bg-white cursor-not-allowed"
              : darkMode
              ? "text-gray-300 border-gray-700 bg-gray-800 hover:bg-gray-700"
              : "text-gray-500 border-gray-300 bg-white hover:bg-gray-50"
          }`}
        >
          Siguiente &raquo;
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
