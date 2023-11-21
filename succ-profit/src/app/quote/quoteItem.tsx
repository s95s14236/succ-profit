import { Quote } from "@/type/stock";
import { fixedStrNum } from "@/utils/helper";
import { CaretDown, CaretUp } from "../components/icons/icons";
import { Dispatch, FormEvent, SetStateAction, memo } from "react";
import { useStockStore } from "@/stores/stock";

interface props {
  quote: Quote;
  checkStocks: string[];
  setCheckStocks: Dispatch<SetStateAction<string[]>>;
}

function QuoteItem({ quote, checkStocks, setCheckStocks }: props) {
  const { focusStockCode, setFocusStockCode } = useStockStore(
    (state) => ({
      focusStockCode: state.focusStockCode,
      setFocusStockCode: state.setFocusStockCode,
    })
  );
  const yesterdayPrice = fixedStrNum(quote.y, 2);
  let priceColor = "";
  let currPrice: number = 0;
  let priceLimitColor = "";

  if (quote.z !== "-") {
    currPrice = fixedStrNum(quote.z, 2);
    priceColor =
      currPrice - yesterdayPrice > 0
        ? "text-red-600"
        : currPrice - yesterdayPrice < 0
        ? "text-green-600"
        : "";
    if (currPrice === fixedStrNum(quote.w, 2)) {
      priceLimitColor = "bg-green-600 text-white";
    } else if (currPrice === fixedStrNum(quote.u, 2)) {
      priceLimitColor = "bg-red-600 text-white";
    }
  }

  const onItemClick = () => {
    setFocusStockCode(quote.c);
  };

  const onCheckedChange = (e: FormEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const checked = e.currentTarget.checked;
    setCheckStocks((prev) => {
      const set = new Set(prev);
      if (checked) {
        set.add(quote.c);
      } else {
        set.delete(quote.c);
      }
      return Array.from(set);
    });
  };

  return (
    <div
      className={`flex flex-row ${focusStockCode === quote.c && "bg-blue-100"}`}
      onClick={onItemClick}
    >
      <div
        className="min-w-[50px] flex-end"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <input
          type="checkbox"
          className="w-5 h-5"
          onChange={onCheckedChange}
          checked={checkStocks.includes(quote.c)}
        />
      </div>
      <div className="min-w-[90px] flex-end">{quote.c}</div>
      <div className="min-w-[120px] flex-end">{quote.n}</div>
      {/* 成交價 */}
      <div className={`min-w-[90px] flex-end ${priceColor}`}>
        <div className={`max-w-full px-1 rounded ${priceLimitColor}`}>
          {currPrice ? currPrice : "-"}
        </div>
      </div>
      {/* 漲跌 */}
      <div className={`min-w-[90px] flex-end ${priceColor}`}>
        {currPrice ? (currPrice - yesterdayPrice).toFixed(2) : "-"}
      </div>
      {/* 漲跌幅 */}
      <div className={`min-w-[90px] flex-end ${priceColor}`}>
        <div className="flex items-center justify-between">
          {(() => {
            if (!currPrice) {
              return;
            }
            if (currPrice - yesterdayPrice > 0) {
              return (
                <div className="mr-1">
                  <CaretUp className="fill-red-500" />
                </div>
              );
            } else if (currPrice - yesterdayPrice < 0) {
              return (
                <div className="mr-1">
                  <CaretDown className="fill-green-500" />
                </div>
              );
            }
          })()}
          {currPrice
            ? `${(
                (Math.abs(currPrice - yesterdayPrice) / yesterdayPrice) *
                100
              ).toFixed(2)}%`
            : "-"}
        </div>
      </div>
      <div className="min-w-[90px] flex-end">
        {quote.h === "-" ? "-" : fixedStrNum(quote.h, 2)}
      </div>
      <div className="min-w-[90px] flex-end">
        {quote.l === "-" ? "-" : fixedStrNum(quote.l, 2)}
      </div>
      <div className="min-w-[90px] flex-end">{quote.tv}</div>
      <div className="min-w-[90px] flex-end">{quote.t}</div>
      <div className="min-w-[90px] flex-end">{quote.v}</div>
      <div className="min-w-[90px] flex-end">
        {quote.h === "-" || quote.l === "-"
          ? "-"
          : `${(
              ((fixedStrNum(quote.h, 2) - fixedStrNum(quote.l, 2)) /
                yesterdayPrice) *
              100
            ).toFixed(2)}%`}
      </div>
    </div>
  );
}

export default memo(QuoteItem);
