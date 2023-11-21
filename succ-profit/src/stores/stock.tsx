import { ALL_EXCHANGE } from "@/constants/exchange";
import { ALL_STOCK } from "@/constants/stock";
import { Quote, WatchlistItem } from "@/type/stock";
import { fixedStrNum } from "@/utils/helper";
import { LogicalRange, TimeRange } from "lightweight-charts";
import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

interface StockState {
  focusStockName: string;
  focusStockCode: string;
  focusStockYahooCode: string;
  setFocusStockCode: (stock: string) => void;
}

const useStockStore = createWithEqualityFn<StockState>((set) => ({
  focusStockName: "",
  focusStockCode: "",
  focusStockYahooCode: "",
  setFocusStockCode: (stock) =>
    set(() => {
      let yahooStock = stock;
      let stockName = "";
      if (ALL_STOCK[stock]) {
        yahooStock = yahooStock + ".TW";
        stockName = ALL_STOCK[stock];
      } else if (ALL_EXCHANGE[stock]) {
        yahooStock = yahooStock + ".TWO";
        stockName = ALL_EXCHANGE[stock];
      }
      return {
        focusStockCode: stock,
        focusStockYahooCode: yahooStock,
        focusStockName: stockName,
      };
    }),
}), shallow);

interface QuoteState {
  quotes: Quote[];
  newestPrice: { [key: string]: number };
  initQuotes: (newQuotes: Quote[]) => void;
  updateQuotes: (newQuotes: Quote[]) => void;
  removeSymbols: (symbolCodes: string[]) => void;
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
  removeSymbols: (symbolCodes) =>
    set((state) => ({
      ...state,
      quotes: state.quotes.filter((q) => symbolCodes.includes(q.c)),
    })),
}));

interface WatchlistState {
  watchlist: WatchlistItem[];
  setWatchlist: (watchlist: WatchlistItem[]) => void;
}

const useWatchlistStore = create<WatchlistState>((set) => ({
  watchlist: [],
  setWatchlist: (watchlist) => set(() => ({ watchlist })),
}));

interface ChartState {
  setTimeRange: (timeRange: LogicalRange | null) => void;
  timeRange: LogicalRange | null;
}

const useChartStore = create<ChartState>((set) => ({
  timeRange: null,
  setTimeRange: (timeRange) => set(() => ({ timeRange })),
}));

export { useQuoteStore, useStockStore, useWatchlistStore, useChartStore };
