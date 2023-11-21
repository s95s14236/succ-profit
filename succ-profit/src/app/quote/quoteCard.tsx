import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuoteStore, useStockStore } from "@/stores/stock";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import QuoteItem from "./quoteItem";
import { WatchlistItem } from "@/type/stock";
import { DEFAULT_WATCHLIST } from "@/constants/stock";
import { genStockFormat } from "@/utils/helper";
import AddSymbolDialog from "./addSymbolDialog";
import { shallow } from "zustand/shallow";

function QuoteCard() {
  const { quotes, initQuotes, updateQuotes } = useQuoteStore((state) => ({
    quotes: state.quotes,
    initQuotes: state.initQuotes,
    updateQuotes: state.updateQuotes,
  }));
  const { focusStockCode, setFocusStockCode } = useStockStore(
    (state) => ({
      focusStockCode: state.focusStockCode,
      setFocusStockCode: state.setFocusStockCode,
    })
  );
  const [checkStocks, setCheckStocks] = useState<string[]>([]);
  const watchlistRef = useRef<WatchlistItem[]>();
  const intervalRef = useRef<NodeJS.Timer>();

  const addButton = useMemo(() => <Button>新增</Button>, []);

  useEffect(() => {
    const getQuote = async () => {
      let watchlistStr = localStorage.getItem("watchlists");
      if (!watchlistStr) {
        watchlistStr = JSON.stringify(DEFAULT_WATCHLIST);
        localStorage.setItem("watchlists", watchlistStr);
      }
      const watchlists: WatchlistItem[] = JSON.parse(watchlistStr);
      watchlistRef.current = watchlists;
      const data = {
        stocks: genStockFormat(watchlists[0].stks),
      };
      const res = await fetch("/api/quote", {
        body: JSON.stringify(data),
        method: "POST",
      });
      const quote = await res.json();
      initQuotes(quote.stocks);

      // 5秒query最新報價
      if (!intervalRef.current) {
        intervalRef.current = setInterval(async () => {
          console.log("fetch quote");
          console.log(watchlistRef.current);
          if (watchlistRef.current) {
            const data = {
              stocks: genStockFormat(watchlistRef.current[0].stks),
            };
            const res = await fetch("/api/quote", {
              body: JSON.stringify(data),
              method: "POST",
            });
            const quote = await res.json();
            console.log(quote);
            updateQuotes(quote.stocks);
          }
        }, 5000);
      }
    };
    getQuote();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [initQuotes, updateQuotes]);

  /**
   * 移除自選股票 (多選)
   */
  const onDeleteSymbolClick = () => {
    if (watchlistRef.current) {
      const watchlist = watchlistRef.current;
      checkStocks.forEach((checkStkCode) => {
        watchlist[0].stks = watchlist[0].stks.filter(
          (stk) => stk.code !== checkStkCode
        );
        updateQuotes(quotes.filter((q) => q.c !== checkStkCode));
      });
      watchlistRef.current = watchlist;
      localStorage.setItem("watchlists", JSON.stringify(watchlist));
      setCheckStocks([]);
      if (checkStocks.includes(focusStockCode)) {
        setFocusStockCode("");
      }
    }
  };

  return (
    <Card className="w-[98%]">
      <CardHeader>
        <div className="flex items-center">
          <AddSymbolDialog trigger={addButton} watchlistRef={watchlistRef} />
          <Button
            className="ml-2 bg-red-500 hover:bg-red-500"
            disabled={checkStocks.length <= 0}
            onClick={onDeleteSymbolClick}
          >
            删除
          </Button>
        </div>
      </CardHeader>

      <CardContent className="w-full h-[80%]">
        <div className="flex flex-col w-full h-full overflow-x-auto">
          <div className="flex flex-row sticky top-0 bg-white">
            <div className="min-w-[50px] flex-end bg-white"></div>
            <div className="min-w-[90px] flex-end bg-white">代號</div>
            <div className="min-w-[120px] flex-end bg-white">名稱</div>
            <div className="min-w-[90px] flex-end bg-white">成交價</div>
            <div className="min-w-[90px] flex-end bg-white">漲跌</div>
            <div className="min-w-[90px] flex-end bg-white">漲跌幅(%)</div>
            <div className="min-w-[90px] flex-end bg-white">最高</div>
            <div className="min-w-[90px] flex-end bg-white">最低</div>
            <div className="min-w-[90px] flex-end bg-white">成交量</div>
            <div className="min-w-[90px] flex-end bg-white">時間</div>
            <div className="min-w-[90px] flex-end bg-white">總量</div>
            <div className="min-w-[90px] flex-end bg-white">震幅</div>
          </div>
          <div>
            {quotes.length > 0 &&
              quotes.map((quote) => (
                <QuoteItem
                  key={quote.c}
                  quote={quote}
                  checkStocks={checkStocks}
                  setCheckStocks={setCheckStocks}
                />
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(QuoteCard);
