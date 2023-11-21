import { getPreviousMonth } from '@/utils/helper';
import type { NextApiRequest, NextApiResponse } from 'next'
import yahooFinance from 'yahoo-finance2';

async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { stock, previousMonth } = req.query;

    if (!stock || !previousMonth) {
        res.status(500).json({ message: 'invalid parameter' });
        return;
    }

    try {
        const query = stock as string;
        const result = await yahooFinance.historical(query, {
            period1: getPreviousMonth(+previousMonth),
        });
        res.status(200).json({ data: result });
    } catch (err) {
        res.status(500).json({ message: 'query fail' });
    }

}

export default handler;