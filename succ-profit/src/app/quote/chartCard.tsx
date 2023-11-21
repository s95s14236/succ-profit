import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Historical } from "@/type/stock";
import { memo, useEffect, useRef, useState } from "react";
import Chart from "../components/chart";
import { useStockStore } from "@/stores/stock";
import { LogicalRange } from "lightweight-charts";
import { shallow } from "zustand/shallow";

interface QuoteRes {
  close: number;
  open: number;
  high: number;
  low: number;
  date: string;
  volume: number;
}

function ChartCard() {
  const [stockData, setStockData] = useState<Historical[]>([]);
  const [chartState, setChartState] = useState({
    loading: false,
    error: false,
  });
  const { focusStockYahooCode, focusStockCode, focusStockName } = useStockStore(
    (state) => ({
      focusStockYahooCode: state.focusStockYahooCode,
      focusStockCode: state.focusStockCode,
      focusStockName: state.focusStockName,
    })
  );
  const [intervalTime, setIntervalTime] = useState("1d");
  const intervalRef = useRef<NodeJS.Timer>();
  const timeRangeRef = useRef<LogicalRange | null>(null);
  const intervalOptions = [
    { value: "15m", label: "15m" },
    { value: "30m", label: "30m" },
    { value: "60m", label: "1h" },
    { value: "1d", label: "1d" },
    { value: "1wk", label: "1wk" },
    { value: "1mo", label: "1mo" },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!focusStockYahooCode) return;
        const res = await fetch(
          `/api/yahoo/chart/${focusStockYahooCode}?interval=${intervalTime}`
        );
        const data = await res.json();
        const quotes: Historical[] = data.data.quotes.map((q: QuoteRes) => ({
          close: q.close,
          open: q.open,
          high: q.high,
          low: q.low,
          date: q.date,
          volume: q.volume,
        }));

        console.log(quotes);

        setStockData(quotes);
        setChartState({ loading: false, error: false });
      } catch (err) {
        console.error("error: ", err);
        setChartState({ loading: false, error: true });
      }
    };

    const fetchInterval = () => {
      fetchData();
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          fetchData();
        }, 5000);
      }
    };

    fetchInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [focusStockYahooCode, intervalTime]);

  useEffect(() => {
    // 當切換focus stock, 清除原stock chart timeRange值
    timeRangeRef.current = null;
  }, [focusStockCode]);

  const onTabChange = (value: string) => {
    // 切換chart interval, 清除原stock chart timeRange值
    timeRangeRef.current = null;
    setIntervalTime(value);
  };

  return (
    <Card className="w-[98%]">
      <CardHeader className="pt-6 pb-0">
        <CardTitle>
          {focusStockName} {focusStockCode} 圖表
        </CardTitle>
        <Tabs
          defaultValue="account"
          className="w-[400px]"
          value={intervalTime.toString()}
          onValueChange={onTabChange}
        >
          <TabsList>
            {intervalOptions.map((opt) => (
              <TabsTrigger key={opt.label} value={opt.value.toString()}>
                {opt.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="h-[80%]">
        {chartState.loading ? (
          <p>loading...</p>
        ) : chartState.error ? (
          <p>無法顯示圖表</p>
        ) : (
          stockData?.length > 0 && (
            <Chart data={stockData} timeRangeRef={timeRangeRef} />
          )
        )}
      </CardContent>
    </Card>
  );
}

export default memo(ChartCard);
