// {
//     time: "2018-10-22",
//     open: 180.82,
//     high: 181.4,
//     low: 177.56,
//     close: 178.75
// }

import { UTCTimestamp } from "lightweight-charts";

export interface CandlesTick {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface Volumn {
    time: UTCTimestamp;
    value: number;
    color?: string;
}

export interface Historical {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    adjClose: number;
    volume: number;
}

export interface WatchStock {
    prefix: string;
    code: string;
    postfix: string;
}

export interface WatchlistItem {
    id: number;
    name: string;
    stks: WatchStock[];
}

/**
 *  tlong	epoch毫秒數
    f	    揭示賣量(配合「a」，以_分隔資料)
    ex	    上市別(上市:tse，上櫃:otc，空白:已下市或下櫃)
    g	    揭示買量(配合「b」，以_分隔資料)
    d	    最近交易日期(YYYYMMDD)
    b	    揭示買價(從高到低，以_分隔資料)
    c	    股票代號
    a	    揭示賣價(從低到高，以_分隔資料)
    n   	公司簡稱
    o   	開盤
    l	    最低
    h   	最高
    w   	跌停價
    v   	累積成交量
    u   	漲停價
    t   	最近成交時刻(HH:MM:SS)
    tv  	當盤成交量
    nf  	公司全名
    z   	當盤成交價
    y   	昨收
 */
export interface Quote {
    /** 當盤成交量 */
    tv: string;
    ps: string;
    pz: string;
    bp: string;
    /** 揭示賣價(從低到高，以_分隔資料) */
    a: string;
    /** 揭示買價(從高到低，以_分隔資料) */
    b: string;
    /** 股票代號 */
    c: string;
    /** 最近交易日期(YYYYMMDD) */
    d: string;
    ch: string;
    /** epoch毫秒數 */
    tlong: string;
    /** 揭示賣量(配合「a」，以_分隔資料) */
    f: string;
    ip: string;
    /** 揭示買量(配合「b」，以_分隔資料) */
    g: string;
    mt: string;
    /** 最高 */
    h: string;
    i: string;
    it: string;
    /** 最低 */
    l: string;
    /** 公司簡稱 */
    n: string;
    /** 開盤 */
    o: string;
    p: string;
    /** 上市別(上市:tse，上櫃:otc，空白:已下市或下櫃) */
    ex: string;
    s: string;
    /** 最近成交時刻(HH:MM:SS) */
    t: string;
    /** 漲停價 */
    u: string;
    /** 累積成交量 */
    v: string;
    /** 跌停價 */
    w: string;
    /** 公司全名 */
    nf: string;
    /** 昨收 */
    y: string;
    /** 當盤成交價 */
    z: string;
    ts: string;
}