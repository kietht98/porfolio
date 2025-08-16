import { Flex, Select, TextField, Button } from "@radix-ui/themes";
import React from "react";
import { RxMagnifyingGlass } from "react-icons/rx";
import { LABELS_GRAMMAR } from "../../constants";

interface GrammarControlsProps {
  selectedGrammar: string;
  onGrammarChange: (grammar: string) => void;
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  isHiddenEn: boolean;
  isHiddenVn: boolean;
  onToggleEn: () => void;
  onToggleVn: () => void;
}

const GrammarControls: React.FC<GrammarControlsProps> = ({
  selectedGrammar,
  onGrammarChange,
  keyword,
  onKeywordChange,
  isHiddenEn,
  isHiddenVn,
  onToggleEn,
  onToggleVn,
}) => {
  return (
    <Flex gap="3" className="flex-wrap justify-start">
      <Select.Root
        size="3"
        value={selectedGrammar}
        onValueChange={onGrammarChange}
      >
        <Select.Trigger aria-label="Select grammar category" />
        <Select.Content>
          {LABELS_GRAMMAR.map((label) => (
            <Select.Item value={label} key={`${label}-select`}>
              {label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      <TextField.Root
        placeholder="Search grammar items..."
        size="3"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        aria-label="Search grammar items"
      >
        <TextField.Slot>
          <RxMagnifyingGlass height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>

      <Button
        onClick={onToggleEn}
        className="!h-9"
        color={isHiddenEn ? "red" : "blue"}
        aria-label={`Toggle English visibility - currently ${
          isHiddenEn ? "hidden" : "visible"
        }`}
      >
        EN: {isHiddenEn ? "Turn on" : "Turn off"}
      </Button>

      <Button
        onClick={onToggleVn}
        radius="medium"
        color={isHiddenVn ? "red" : "blue"}
        className="!h-9"
        aria-label={`Toggle Vietnamese visibility - currently ${
          isHiddenVn ? "hidden" : "visible"
        }`}
      >
        VN: {isHiddenVn ? "Turn on" : "Turn off"}
      </Button>
    </Flex>
  );
};

export default React.memo(GrammarControls);
