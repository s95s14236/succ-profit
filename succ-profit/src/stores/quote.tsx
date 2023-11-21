import { Quote } from "@/type/stock";
import { fixedStrNum } from "@/utils/helper";
import { create } from "zustand";

interface QuoteState {
  quotes: Quote[];
  newestPrice: { [key: string]: number };
  initQuotes: (newQuotes: Quote[]) => void;
  updateQuotes: (newQuotes: Quote[]) => void;
}

const useQuoteStore = create<QuoteState>((set) => ({
  quotes: [],
  newestPrice: {},
  initQuotes: (newQuotes) => {
    const price: { [key: string]: number } = {};
    newQuotes.forEach((q) => {
      if (q.z !== "-") {
        price[q.c] = fixedStrNum(q.z, 2);
      }
    });
    set(() => {
      return { quotes: newQuotes, newestPrice: price };
    });
  },
  updateQuotes: (newQuotes) =>
    set((state) => {
      const updatedQuotes = newQuotes.map((q) => {
        if (q.z !== "-") {
          state.newestPrice[q.c] = fixedStrNum(q.z, 2);
        } else {
          q.z = state.newestPrice[q.c]
            ? state.newestPrice[q.c].toString()
            : "-";
        }
        return q;
      });

      return {
        quotes: updatedQuotes,
        newestPrice: state.newestPrice,
      };
    }),
}));

export { useQuoteStore };
