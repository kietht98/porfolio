import { speak } from "@/app/utils/actionVocabulary";
import { Flex } from "@radix-ui/themes";
import React from "react";
import { RiHeadphoneLine } from "react-icons/ri";
import { GrammarItem as GrammarItemType } from "../types";
import InputEN from "../InputEN";

interface GrammarItemProps {
  item: GrammarItemType;
  isHiddenEn: boolean;
  isHiddenVn: boolean;
}

const GrammarItem: React.FC<GrammarItemProps> = ({
  item,
  isHiddenEn,
  isHiddenVn,
}) => {
  const handleSpeak = () => {
    speak({
      contentEN: item.phrase,
    });
  };

  return (
    <Flex gap="4" className="items-center" key={item.phrase}>
      <RiHeadphoneLine
        size={16}
        className="hover:cursor-pointer hover:bg-white rounded-full p-1 transition-colors"
        onClick={handleSpeak}
        role="button"
        tabIndex={0}
        aria-label={`Listen to pronunciation of: ${item.phrase}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleSpeak();
          }
        }}
      />
      <span className="font-medium">
        <InputEN label={item.phrase} hidden={isHiddenEn} />
      </span>
      <span>:</span>
      <span>
        <InputEN label={item.meaning} hidden={isHiddenVn} />
      </span>
    </Flex>
  );
};

export default React.memo(GrammarItem);
