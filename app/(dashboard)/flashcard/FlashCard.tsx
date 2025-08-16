import { speak } from "@/app/utils/actionVocabulary";
import React, { useState } from "react";
import { FiVolume2 } from "react-icons/fi";

const FlashCardComp = (props?: any) => {
  const { vocabulary } = props;
  const [collapse, setCollapse] = useState(true);
  const onTouch = () => {
    setCollapse((prev) => !prev);
  };
  return (
    <div className="w-[320px]  md:w-[820px] h-[260px] md:h-[480px] mx-auto relative">
      <button
        className="bg-white w-[320px] md:w-[820px] h-[240px] md:h-[420px] p-2 rounded-2xl shadow-md mx-auto rotateX(0deg) rotateY(0deg) rotateZ(0deg) transition-all duration-300"
        style={{
          transform: collapse
            ? ""
            : "rotateX(190deg) rotateY(0deg) rotateZ(0deg)",
          position: "absolute",
          zIndex: collapse ? 2 : 1,
        }}
        onClick={onTouch}
      >
        <div className="absolute right-8 top-8">
          <FiVolume2
            size={40}
            color="white"
            className="hover:cursor-pointer hover:bg-blue-700 bg-blue-600 p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              speak({
                contentEN: vocabulary?.phrase,
                contentVN: vocabulary?.meaning,
              });
            }}
          />
        </div>
        <span className="text-3xl ">{vocabulary?.phrase}</span>
      </button>
      <button
        className="bg-white w-[320px] md:w-[820px] h-[240px] md:h-[420px] p-2 rounded-2xl shadow-lg mx-auto rotateX(0deg) rotateY(0deg) rotateZ(0deg) transition-all duration-300"
        style={{
          transform: collapse
            ? ""
            : "rotateX(190deg) rotateY(0deg) rotateZ(0deg)",
          position: "absolute",
          zIndex: collapse ? 1 : 2,
        }}
        onClick={onTouch}
      >
        <div
          className="transition-all duration-100"
          style={{
            transform: "rotateX(190deg)",
          }}
        >
          <span className="text-3xl ">{vocabulary?.meaning}</span>
        </div>
      </button>
    </div>
  );
};

export default FlashCardComp;
