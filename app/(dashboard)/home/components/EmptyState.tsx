import React from "react";
import { RxFile } from "react-icons/rx";

const EmptyState: React.FC = () => {
  return (
    <div className="m-auto w-fit h-fit absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <RxFile size={80} color="gray" className="mx-auto mb-4" />
        <p className="text-gray-500 text-sm">No grammar items found</p>
      </div>
    </div>
  );
};

export default EmptyState;
