import { create } from "zustand";

import { LABELS_GRAMMAR } from "../(dashboard)/constants";

interface BearState {
  role: string;
  vocabularyAdj: any;
  vocabularyAdv: any;
  vocabularyNoun: any;
  totals: any;
  getTotals: (props: any) => void;
  getVocabularyAdj: (props: any) => void;
  getVocabularyAdv: (props: any) => void;
  getVocabularyNoun: (props: any) => void;
  setRole: (props: any) => void;
}

const useStoreBase = create<BearState>()((set) => ({
  vocabularyAdj: [],
  vocabularyAdv: [],
  vocabularyNoun: [],
  totals: {},
  role: "ADMIN",
  getTotals: (vocal) =>
    set((state) => ({
      totals: {
        ...state.totals,
        ...vocal,
      },
    })),
  setRole: (item) => set(() => ({ role: item })),
  getVocabularyAdj: (vocab) =>
    set((state) => ({ vocabularyAdj: [...state.vocabularyAdj, ...vocab] })),
  getVocabularyAdv: (vocab) =>
    set((state) => ({ vocabularyAdv: [...state.vocabularyAdv, ...vocab] })),
  getVocabularyNoun: (vocab) =>
    set((state) => ({ vocabularyNoun: [...state.vocabularyNoun, ...vocab] })),
}));

const asyncCatch = (url: string) => {
  return fetch(url)
    .then((res) => res.json())
    .then((resp) => resp?.data as any[])
    .catch((err) => []);
};
type GrammarState = {
  data: any;
  loading: boolean;
  error: any;
  isEmpty: boolean;
  fetchData: VoidFunction;
  setVocabularies: (vocab: any) => void;
};

const useStoreGrammars = create<GrammarState>((set) => ({
  data: null,
  loading: true,
  error: null,
  isEmpty: true,
  fetchData: async () => {
    set({ loading: true });
    try {
      const response = await Promise.all([
        asyncCatch("/api/vocabulary/adv"),
        asyncCatch("/api/vocabulary/adj"),
        asyncCatch("/api/vocabulary/noun"),
        asyncCatch("/api/vocabulary/common"),
        asyncCatch("/api/vocabulary/conjunction"),
      ]);
      let mapData = {};
      response.forEach((item, index) => {
        Object.assign(mapData, {
          [LABELS_GRAMMAR[index]]: item,
        });
      });
      set({ data: mapData, loading: false, isEmpty: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  setVocabularies: (vocab) => {
    set((state) => ({ data: { ...state.data, ...vocab } }));
  },
}));

export { useStoreBase, useStoreGrammars };
