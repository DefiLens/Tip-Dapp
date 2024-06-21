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