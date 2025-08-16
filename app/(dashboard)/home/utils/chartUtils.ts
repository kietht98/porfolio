import { GrammarData } from "../types";
import { LABELS_GRAMMAR } from "../../constants";

export const mapDataChart = (grammars: GrammarData): number[] => {
  return LABELS_GRAMMAR.map((item) => grammars[item]?.length || 0);
};

export const getChartColors = () => [
  "rgb(255, 99, 132)",
  "rgb(54, 162, 235)",
  "rgb(255,140,0)",
  "rgb(105,105,105)",
  "rgb(176,196,222)",
  "rgb(255, 205, 86)",
];
