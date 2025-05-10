/**
 * Formats a Date object into a string representation.
 * 
 * @param date - The Date object to format
 * @returns A string in the format 'DD-MM-YYYY'
 * 
 * @example
 * // Returns "01-01-2023"
 * formatDate(new Date(2023, 0, 1));
 */
export const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

/**
 * Formats a Date object as a string in the format "dd-mm-yyyy hh:mm".
 * 
 * @param date - The Date object to format
 * @returns A string representation of the date in "dd-mm-yyyy hh:mm" format
 * 
 * @example
 * // Returns "01-05-2023 14:30"
 * formatDateTime(new Date(2023, 4, 1, 14, 30));
 */
export const formatDateTime = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

/**
 * Parses a datetime string in the format "DD-MM-YYYY HH:MM" to a Date object.
 * 
 * @param dateString - The datetime string to parse in format "DD-MM-YYYY HH:MM"
 * @returns A Date object representing the parsed datetime in local timezone, or null if parsing fails
 * 
 * @example
 * ```
 * // Returns a Date object for January 15, 2023, 14:30 local time
 * parseDateTime('15-01-2023 14:30');
 * 
 * // Returns null for invalid input
 * parseDateTime(''); // null
 * parseDateTime('15-01-2023'); // null (missing time part)
 * parseDateTime('15-XX-2023 14:30'); // null (invalid numbers)
 * ```
 */
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