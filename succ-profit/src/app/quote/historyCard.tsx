import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Historical } from "@/type/stock";
import { memo, useEffect, useState } from "react";
import Chart from "../components/chart";

interface Props {
  stockCode: string;
}

function HistoryCard({ stockCode }: Props) {
  const [stockData, setStockData] = useState<Historical[]>([]);
  const periodOptions = [
    { value: "15m", label: "15m" },
    { value: "30m", label: "30m" },
    { value: "60m", label: "1h" },
    { value: "1d", label: "1d" },
    { value: "1wk", label: "1wk" },
    { value: "1mo", label: "1mo" },
  ];
  const [period, setPeriod] = useState("15m");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/yahoo/history/${stockCode}?period=${period}`
        );
        const data = await res.json();
        setStockData(data.data);
      } catch (err) {
        console.error("error: ", err);
      }
    };
    fetchData();
  }, [stockCode, period]);

  const onTabChange = (value: string) => {
    setPeriod(value);
  };
  return (
    <Card className="w-[98%]">
      <CardHeader>
        <Tabs
          defaultValue="account"
          className="w-[400px]"
          value={period.toString()}
          onValueChange={onTabChange}
        >
          <TabsList>
            {periodOptions.map((opt) => (
              <TabsTrigger key={opt.label} value={opt.value.toString()}>
                {opt.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {stockData?.length > 0 && <Chart data={stockData} />}
      </CardContent>
    </Card>
  );
}

export default memo(HistoryCard);
