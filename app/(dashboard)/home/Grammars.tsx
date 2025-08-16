import { ScrollArea, Box, Flex } from "@radix-ui/themes";
import React, { useCallback, useMemo, useState } from "react";
import { LABELS_GRAMMAR } from "../constants";
import { GrammarsProps, GrammarItem as GrammarItemType } from "./types";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import GrammarControls from "./components/GrammarControls";
import GrammarItem from "./components/GrammarItem";
import EmptyState from "./components/EmptyState";

const Grammars: React.FC<GrammarsProps> = ({ queryGrammars }) => {
  const [keyword, setKeyword] = useState("");
  const [selectedGrammar, setSelectedGrammar] = useState(LABELS_GRAMMAR[0]);
  const [isHiddenEn, setIsHiddenEn] = useState(false);
  const [isHiddenVn, setIsHiddenVn] = useState(false);

  const toggleEn = useCallback(() => setIsHiddenEn((prev) => !prev), []);
  const toggleVn = useCallback(() => setIsHiddenVn((prev) => !prev), []);

  useKeyboardShortcuts({
    onToggleEn: toggleEn,
    onToggleVn: toggleVn,
  });

  const filteredItems = useMemo(() => {
    const items = queryGrammars.data?.[selectedGrammar] || [];
    if (!keyword.trim()) return items;

    return items.filter(
      (item: GrammarItemType) =>
        item.phrase.toLowerCase().includes(keyword.toLowerCase()) ||
        item.meaning.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [queryGrammars.data, selectedGrammar, keyword]);

  const handleGrammarChange = useCallback((grammar: string) => {
    setSelectedGrammar(grammar);
    setKeyword(""); // Reset search when changing grammar category
  }, []);

  const handleKeywordChange = useCallback((newKeyword: string) => {
    setKeyword(newKeyword);
  }, []);

  return (
    <div className="space-y-4">
      <GrammarControls
        selectedGrammar={selectedGrammar}
        onGrammarChange={handleGrammarChange}
        keyword={keyword}
        onKeywordChange={handleKeywordChange}
        isHiddenEn={isHiddenEn}
        isHiddenVn={isHiddenVn}
        onToggleEn={toggleEn}
        onToggleVn={toggleVn}
      />

      <ScrollArea
        type="always"
        scrollbars="vertical"
        style={{
          height: 240,
          background: "#f1f3f4",
          borderRadius: 16,
          padding: 12,
        }}
        className="relative"
      >
        <Box p="2" pr="8">
          {filteredItems.length > 0 ? (
            <Flex direction="column" gap="4">
              {filteredItems.map((item: GrammarItemType) => (
                <GrammarItem
                  key={`${item.phrase}-${selectedGrammar}`}
                  item={item}
                  isHiddenEn={isHiddenEn}
                  isHiddenVn={isHiddenVn}
                />
              ))}
            </Flex>
          ) : (
            <EmptyState />
          )}
        </Box>
      </ScrollArea>
    </div>
  );
};

export default React.memo(Grammars);
