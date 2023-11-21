import { getPreviousMonth } from '@/utils/helper';
import { ChartOptions } from 'lightweight-charts';
import type { NextApiRequest, NextApiResponse } from 'next'
import yahooFinance from 'yahoo-finance2';
import moment from 'moment';

async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { stock, interval } = req.query;

    const intervalDays: { [key: string]: number } = {
        "15m": 59,
        "30m": 59,
        "60m": 59,
        "1d": 729,
        "1wk": 360 * 2,
        "1mo": 360 * 10,
    };

    const intervalStr = interval as "1m" | "2m" | "5m" | "15m" | "30m" | "60m" | "90m" | "1h" | "1d" | "5d" | "1wk" | "1mo" | "3mo";
    
    if (!stock || !intervalDays[intervalStr]) {
        res.status(500).json({ message: 'invalid parameter' });
        return;
    }
    let d;
    try {
        const query = stock as string;
        const period1 = moment().subtract(intervalDays[intervalStr], 'days').toDate();

        const result = await yahooFinance._chart(query, { period1, interval: intervalStr });

        res.status(200).json({ data: result });
    } catch (err) {
        console.log("err=", err);
        res.status(500).json({ message: 'query fail' });
    }

}

export default handler;