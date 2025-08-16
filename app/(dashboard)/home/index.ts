// Main page component
export { default as Dashboard } from "./page";

// Individual components
export { default as Grammars } from "./Grammars";
export { default as InputEN } from "./InputEN";
export { default as ChartJS } from "./ChartJS";
export { default as DecorativeBox } from "./DecorativeBox";

// Sub-components
export { default as GrammarControls } from "./components/GrammarControls";
export { default as GrammarItem } from "./components/GrammarItem";
export { default as EmptyState } from "./components/EmptyState";

// Hooks
export { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

// Utils
export { mapDataChart, getChartColors } from "./utils/chartUtils";

// Types
export * from "./types";
