export interface GrammarItem {
  phrase: string;
  meaning: string;
}

export interface GrammarData {
  [key: string]: GrammarItem[];
}

export interface QueryGrammarsResult {
  data: GrammarData;
  loading: boolean;
  isEmpty: boolean;
  fetchData: () => void;
}

export interface DecorativeBoxProps {
  title: string;
  count: number;
}

export interface DoughnutChartProps {
  labels: string[];
  dataSource: number[];
  callBack?: (event: any, elements: any) => void;
}

export interface InputENProps {
  label: string;
  hidden: boolean;
}

export interface GrammarsProps {
  queryGrammars: QueryGrammarsResult;
  key?: string;
}
