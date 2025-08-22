import React from "react";

// eslint-disable-next-line react/prop-types
const ProductSignUpButton = ({ loading, children, className = "", ...rest }) => (
  <button
    type="submit"
    disabled={loading}
    className={`flex justify-center items-center mt-6 px-5 w-32 min-w-32 min-h-10 py-2 rounded-lg text-white font-bold transition duration-300 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed disabled:text-white ${className}`}
    {...rest}
  >
    {loading ? (
      <svg
        className="size-5 animate-spin text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    ) : (
      children
    )}
  </button>
);

export default ProductSignUpButton;

