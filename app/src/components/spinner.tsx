export const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <svg
        className="w-10 h-10 text-blue-500 animate-spin"
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
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0112 4V0C6.486 0 2 4.486 2 10h4zm7.708-2.293a8.045 8.045 0 012.585 2.585l2.828-2.828a10.045 10.045 0 00-3.414-3.414l-2.828 2.828zM20 12a8 8 0 01-8 8v4c5.627 0 10-4.373 10-10h-4z"
        ></path>
      </svg>
    </div>
  );
};
