import { RiAliensLine } from "react-icons/ri";
import { BG_COLOR } from "../constants";
import { DecorativeBoxProps } from "./types";
import React from "react";

const DecorativeBox: React.FC<DecorativeBoxProps> = ({ title, count }) => {
  const bgColor = BG_COLOR[title as keyof typeof BG_COLOR] || "#6b7280";
  const displayTitle = title?.length < 5 ? `${title} tense` : title;

  return (
    <div
      className="p-4 rounded-md shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white"
      role="region"
      aria-label={`${title} grammar category with ${count} items`}
    >
      <div className="flex flex-col gap-2 justify-center">
        <div className="w-fit mr-auto">
          <RiAliensLine color={bgColor} size={32} aria-hidden="true" />
        </div>
        <div className="text-3xl font-medium text-start text-gray-800">
          {count.toLocaleString()}
        </div>
        <div className="text-start text-gray-600 font-medium whitespace-nowrap">
          {displayTitle}
        </div>
      </div>
    </div>
  );
};

export default React.memo(DecorativeBox);
