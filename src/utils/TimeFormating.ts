export const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

export const formatDateTime = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();

    const hours = pad(date.getHours()); 
    const minutes = pad(date.getMinutes());

    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export const parseDateTime = (dateString: string): Date | null => {
    const [date, time] = dateString.split(' ');

    if (!date || !time) return null;

    const [day, month, year] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);

    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes)) {
        return null;
    }

    // Month is 0-indexed in JavaScript
    return new Date(year, month - 1, day, hours, minutes);
};