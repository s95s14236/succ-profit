"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ALL_EXCHANGE } from "@/constants/exchange";
import { ALL_STOCK } from "@/constants/stock";
import { WatchlistItem } from "@/type/stock";
import {
  ChangeEvent,
  FormEvent,
  MutableRefObject,
  memo,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import { Minus, Plus } from "../components/icons/icons";
import { debounce, genStockFormat } from "@/utils/helper";
import { useQuoteStore } from "@/stores/stock";
import { shallow } from "zustand/shallow";

interface Props {
  trigger: JSX.Element;
  watchlistRef: MutableRefObject<WatchlistItem[] | undefined>;
}

interface Symbol {
  name: string;
  code: string;
}

function AddSymbolDialog({ trigger, watchlistRef }: Props) {
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const { updateQuotes, removeSymbols } = useQuoteStore((state) => ({
    updateQuotes: state.updateQuotes,
    removeSymbols: state.removeSymbols,
  }));

  const onSymbolInputChange = (e: FormEvent<HTMLInputElement>) => {
    console.log("onSymbolInputChange");

    const inputValue = e.currentTarget.value;
    if (!inputValue || inputValue.length < 2) {
      setSymbols([]);
      return;
    }
    const find: Symbol[] = [];
    // array太長, 將操作延後到user event之後, 避免輸入卡頓優化
    setTimeout(() => {
      Object.entries(ALL_STOCK).forEach(([code, name]) => {
        if (code.startsWith(inputValue) || name.startsWith(inputValue)) {
          find.push({ name, code });
        }
      });
      Object.entries(ALL_EXCHANGE).forEach(([code, name]) => {
        if (code.startsWith(inputValue) || name.startsWith(inputValue)) {
          find.push({ name, code });
        }
      });
      setSymbols(find);
    }, 0);
  };

  /**
   * 新增股票 (自選清單)
   */
  const onAddSymbolClick = async (stockCode: string) => {
    if (watchlistRef?.current) {
      const watchlist = watchlistRef.current;
      watchlist[0].stks.push({
        prefix: ALL_STOCK[stockCode] ? "tse" : "otc",
        code: stockCode,
        postfix: "tw",
      });
      watchlistRef.current = watchlist;
      localStorage.setItem("watchlists", JSON.stringify(watchlist));

      const data = {
        stocks: genStockFormat(watchlist[0].stks),
      };
      const res = await fetch("/api/quote", {
        body: JSON.stringify(data),
        method: "POST",
      });
      const quote = await res.json();
      updateQuotes(quote.stocks);
    }
  };

  /**
   * 移除股票 (自選清單)
   */
  const onRemoveSymbolClick = (stockCode: string) => {
    if (watchlistRef?.current) {
      const watchlist = watchlistRef.current;
      watchlist[0].stks = watchlist[0].stks.filter(
        (stk) => stk.code !== stockCode
      );
      removeSymbols([stockCode]);
      watchlistRef.current = watchlist;
      localStorage.setItem("watchlists", JSON.stringify(watchlist));
    }
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setSymbols([]);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>新增股票</DialogHeader>
        <div>
          <Input
            className="w-full mr-4"
            onInput={onSymbolInputChange}
            placeholder=""
          />
          <div className="w-full h-[300px] overflow-auto p-2 mt-2">
            {symbols.length > 0 &&
              symbols.map((symbol) => (
                <div
                  className="p-2 flex justify-between items-center"
                  key={symbol.code}
                >
                  <div>
                    {symbol.code} {symbol.name}
                  </div>
                  {watchlistRef?.current &&
                  watchlistRef.current[0].stks.findIndex(
                    (stk) => stk.code === symbol.code
                  ) === -1 ? (
                    <div
                      className="w-8 h-8 hover:cursor-pointer"
                      onClick={() => onAddSymbolClick(symbol.code)}
                    >
                      <Plus className="w-full h-full" />
                    </div>
                  ) : (
                    <div
                      className="w-8 h-8 hover:cursor-pointer"
                      onClick={() => onRemoveSymbolClick(symbol.code)}
                    >
                      <Minus className="w-full h-full" />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AddSymbolDialog);
