import { BigNumberish } from "@biconomy/account";
import { BigNumber as bg } from "bignumber.js";


export const shorten = (address: string | undefined) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4, address.length)}`;
};

export const postDateFormat = (isoDate: Date | string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const diff = now.getTime() - date.getTime(); // Calculate time difference in milliseconds

    // Calculate elapsed time in seconds, minutes, hours, days, months, and years
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30); // Approximate, not precise
    const years = Math.floor(months / 12);

    if (seconds < 60) {
        return `${seconds} sec ago`;
    } else if (minutes < 60) {
        return `${minutes} min ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days < 30) {
        // return `${days} days ago`;
        if (days === 0) {
            return "Today";
        } else if (days === 1) {
            return "Yesterday";
        } else {
            return `${days} days ago`;
        }
    } else if (months < 12) {
        return date.toLocaleString("en-US", { month: "long", year: "numeric" });
    } else {
        return date.toLocaleString("en-US", { year: "numeric" });
    }
};

export const usdcByChain = {
    "137": {
        usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    },
    "42161": {
        usdc: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    },
    "10": {
        usdc: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    },
    "8453": {
        usdc: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
    },
};

export function decreasePowerByDecimals(amount: BigNumberish | string, decimals: number) {
    return bg(amount.toString()).dividedBy(bg(10).pow(decimals)).toString();
}