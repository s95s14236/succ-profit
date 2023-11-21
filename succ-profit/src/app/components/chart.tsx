"use client";

import {
  CHART_BG_COLOR,
  DOWN_COLOR,
  FONT_COLOR,
  GRID_LINE_COLOR,
  PRICE_SCALE_COLOR,
  UP_COLOR,
  VOLUME_DOWN_COLOR,
  VOLUME_UP_COLOR,
  WICK_COLOR,
} from "@/constants/color";
import { CandlesTick, Historical, Volumn } from "@/type/stock";
import {
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  LogicalRange,
  LogicalRangeChangeEventHandler,
  UTCTimestamp,
  createChart,
} from "lightweight-charts";
import { MutableRefObject, memo, useEffect, useRef } from "react";

interface Props {
  data: Historical[];
  timeRangeRef?: MutableRefObject<LogicalRange | null>;
}

function Chart({ data, timeRangeRef }: Props) {
  const chartElementRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi>();
  const resizeObserverRef = useRef<ResizeObserver>();

  useEffect(() => {
    let candleSeries: ISeriesApi<"Candlestick">;
    let volumeSeries: ISeriesApi<"Histogram">;

    const visibleLogicalRangeChangeHandler: LogicalRangeChangeEventHandler = (
      newVisibleLogicalRange
    ) => {
      if (timeRangeRef) {
        timeRangeRef.current = newVisibleLogicalRange;
      }
    };

    if (chartElementRef.current) {
      chartRef.current = createChart(chartElementRef.current, {
        width: chartElementRef.current.clientWidth,
        // height: 400, //"300px", //chartContainerRef.current.clientHeight,
        layout: {
          background: { color: CHART_BG_COLOR },
          textColor: FONT_COLOR,
        },
        grid: {
          vertLines: {
            color: GRID_LINE_COLOR,
          },
          horzLines: {
            color: GRID_LINE_COLOR,
          },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        rightPriceScale: {
          borderColor: PRICE_SCALE_COLOR,
        },
        timeScale: {
          borderColor: PRICE_SCALE_COLOR,
        },
        localization: {
          timeFormatter: (businessDayOrTimestamp: number) => {
            return new Date(businessDayOrTimestamp * 1000).toLocaleString(); //or whatever JS formatting you want here
          },
        },
      });

      candleSeries = chartRef.current.addCandlestickSeries({
        upColor: UP_COLOR,
        downColor: DOWN_COLOR,
        borderUpColor: UP_COLOR,
        borderDownColor: DOWN_COLOR,
        wickDownColor: WICK_COLOR,
        wickUpColor: WICK_COLOR,
      });
      candleSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.1,
          bottom: 0.3,
        },
      });

      volumeSeries = chartRef.current.addHistogramSeries({
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "",
      });

      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      if (candleSeries && data) {
        const candles: CandlesTick[] = data.map((d) => ({
          time: (Date.parse(d.date) / 1000) as UTCTimestamp,
          open: d.open,
          close: d.close,
          high: d.high,
          low: d.low,
        }));
        candleSeries.setData(candles);
      }

      if (volumeSeries && data) {
        const volumes: Volumn[] = data.map((d) => ({
          time: (Date.parse(d.date) / 1000) as UTCTimestamp,
          value: d.volume,
          color: d.close < d.open ? VOLUME_DOWN_COLOR : VOLUME_UP_COLOR,
        }));
        volumeSeries.setData(volumes);
      }

      if (chartRef.current) {
        chartRef.current
          .timeScale()
          .subscribeVisibleLogicalRangeChange(visibleLogicalRangeChangeHandler);
      }
      if (timeRangeRef?.current) {
        chartRef.current
          .timeScale()
          .setVisibleLogicalRange(timeRangeRef.current);
      }
      // chartRef.current.timeScale().fitContent();
    }

    return () => {
      if (chartRef.current) {
        chartRef.current
          .timeScale()
          .unsubscribeVisibleLogicalRangeChange(
            visibleLogicalRangeChangeHandler
          );
        chartRef.current.remove();
      }
    };
  }, [data, timeRangeRef]);

  useEffect(() => {
    resizeObserverRef.current = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      chartRef.current?.applyOptions({ width, height });
      // setTimeout(() => {
      //   chartRef.current?.timeScale().fitContent();
      // }, 0);
    });

    if (chartElementRef.current) {
      resizeObserverRef.current.observe(chartElementRef.current);
    }

    return () => resizeObserverRef.current?.disconnect();
  }, []);

  return <div className="h-full" ref={chartElementRef}></div>;
}

export default memo(Chart);
