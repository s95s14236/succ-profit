"use client";

// import { rocToGregorianDate } from "@/utils/helper";
// import { CandlesTick } from "@/type/stock";
// import { StockCode } from "@/constants/stock";
import { useEffect } from "react";

async function getQuote(stockId: number) {
  const apiUrl = `https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20230601&stockNo=${stockId}`;
  console.log(apiUrl);
  const res = await fetch(apiUrl);
  return res.json();
}

async function getQuoteFromYahoo(stockId: string) {
  // const res = await fetch('http://localhost:3000/api/yahoo');
  // const data = await res.json();
  // return res.json(data);
}

function Page({ params: { stockId } }: { params: { stockId: number } }) {
  // const data = await getQuote(stockId);
  // const title = data.title;
  // const quoteData: CandlesTick[] = data.data.map((d: any[]) => ({
  //   time: rocToGregorianDate(d[0]),
  //   open: +d[3],
  //   high: +d[4],
  //   low: +d[5],
  //   close: +d[6],
  // }));

  // const results = await getQuoteFromYahoo("AAPL");

  useEffect(() => {
    const watchlist = localStorage.getItem("watchlist");
    if (!watchlist) {
    }
  }, []);

  return (
    <>
      <h1>Quote</h1>
      {/* <h2>{title}</h2> */}
      <input />
      <button>新增自選</button>
    </>
  );
}

export default Page;
