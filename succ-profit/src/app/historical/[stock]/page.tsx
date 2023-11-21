"use client";

import Chart from "@/app/components/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Historical } from "@/type/stock";
import { useEffect, useState } from "react";

function Page({ params: { stock } }: { params: { stock: string } }) {
  const [stockData, setStockData] = useState<Historical[]>([]);
  const previousMonthOptions = [
    { value: 1, label: "1M" },
    { value: 3, label: "3M" },
    { value: 6, label: "6M" },
    { value: 12, label: "1Y" },
    { value: 24, label: "2Y" },
    { value: 60, label: "5Y" },
    { value: 120, label: "10Y" },
  ];
  const [previousMonth, setPreviousMonth] = useState(6);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/yahoo/history/${stock}?previousMonth=${previousMonth}`
        );
        const data = await res.json();
        setStockData(data.data);
      } catch (err) {
        console.error("error: ", err);
      }
    };
    fetchData();
  }, [stock, previousMonth]);

  const onTabChange = (value: string) => {
    setPreviousMonth(Number(value));
  };

  return (
    <>
      <h1>Chart</h1>
      <Tabs
        defaultValue="account"
        className="w-[400px]"
        value={previousMonth.toString()}
        onValueChange={onTabChange}
      >
        <TabsList>
          {previousMonthOptions.map((opt) => (
            <TabsTrigger key={opt.label} value={opt.value.toString()}>
              {opt.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {stockData?.length > 0 && <Chart data={stockData} />}
    </>
  );
}

export default Page;
