import type { FC } from "react";

const Loading: FC = () => {
  return (
    <div className="text-center text-gray-600 italic">
      <div className="flex justify-center items-center space-x-2">
        <div className="w-4 h-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        <span>Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
