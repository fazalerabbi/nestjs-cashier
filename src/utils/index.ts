/**
 * Converts an object into a string representation with key-value pairs separated by 'AND'.
 * Nested objects are flattened with keys in square brackets.
 *
 * @param obj - The object to convert into a string.
 * @returns A string representation of the object with key-value pairs separated by 'AND'.
 */
export const convertObjectToString = (obj: Record<string, any>): string => {
    const parts: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
            for (const [subKey, subValue] of Object.entries(value)) {
                parts.push(`${key}['${subKey}']:'${subValue}'`);
            }
        } else {
            parts.push(`${key}:'${value}'`);
        }
    }

    return parts.join(' AND ');
}