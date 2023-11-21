import { getLocalIP } from '@/utils/helper';
import { NextResponse } from 'next/server'

export const revalidate = false;

export async function POST(request: Request) {
    console.log('IP=', getLocalIP());
    const { stocks } = await request.json();

    const stockStr = `tse_t00.tw|${stocks}`;

    const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${stockStr}&json=1&delay=0`;
    console.log("url=", url);

    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json({ stocks: data.msgArray.slice(1), twIdx: data.msgArray[0] })
}