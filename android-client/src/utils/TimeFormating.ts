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
    console.log('Parsing date string:', dateString);
    
    if (!dateString) {
        console.log('Date string is empty or undefined');
        return null;
    }

    const [date, time] = dateString.split(' ');
    console.log('Split result:', { date, time });

    if (!date || !time) {
        console.log('Invalid date-time format: missing date or time part');
        return null;
    }

    const [day, month, year] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    
    console.log('Parsed components:', {
        day, month, year,
        hours, minutes
    });

    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes)) {
        console.log('Invalid number in date components');
        return null;
    }

    // Create date in local timezone
    const parsedDate = new Date(year, month - 1, day, hours, minutes);
    console.log('Local date:', parsedDate);
    
    return parsedDate;
};