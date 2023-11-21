import { networkInterfaces } from 'os';

export function rocToGregorianDate(rocDate: string) {
    // 將民國年份拆分成年、月、日
    const [year, month, day] = rocDate.split('/').map(Number);

    // 民國年份轉換成西元年份
    const gregorianYear = 1911 + year;

    // 格式化成西元日期
    const formattedDate = `${gregorianYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    return formattedDate;
}

export function getPreviousMonth(months: number) {
    const today = new Date();
    const previousMonth = new Date(today);

    // 將日期設置為上個月的第一天
    previousMonth.setMonth(today.getMonth() - 1 * months, today.getDate());

    return previousMonth;
}

export function genStockFormat(stks: { prefix: string, code: string, postfix: string }[]): string {
    const result = stks.map(({ prefix, code, postfix }) => `${prefix}_${code}.${postfix}`);
    return result.join('|');
}

export function getLocalIP() {
    const interfaces = networkInterfaces();
    let localIP;
    Object.keys(interfaces).forEach((ifaceName) => {
        const iface = interfaces[ifaceName];
        iface?.forEach((ifaceDetails) => {
            if (ifaceDetails.family === 'IPv4' && !ifaceDetails.internal) {
                localIP = ifaceDetails.address;
            }
        });
    });
    return localIP;
}

export function fixedStrNum(strNum: string, digits: number) {
    if (digits > 0) {
        return parseFloat(strNum) * (10 * digits) / (10 * digits);
    } else {
        return parseFloat(strNum);
    }
}

export function debounce<T extends any[]>(func: (...args: T) => void, delay: number) {
    let timer: NodeJS.Timeout;
    return (...args: T) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
};