"use client";

import QuoteCard from "./quoteCard";
import ChartCard from "./chartCard";

function Page() {
  return (
    <div className="h-screen flex flex-col box-border justify-evenly">
      {/* <p className="text-4xl">Quote</p> */}
      <div className="h-[48%] flex w-full justify-center">
        <QuoteCard />
      </div>
      <div className="h-[48%] flex w-full justify-center">
        <ChartCard />
      </div>
    </div>
  );
}

export default Page;
