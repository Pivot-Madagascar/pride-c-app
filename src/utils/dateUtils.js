/**
 * Compares two update data strings directly as strings.
 * This handles both old format (ISO timestamp) and new format (prefixed date).
 * @param {string} data1 - First update data
 * @param {string} data2 - Second update data
 * @returns {boolean} - True if strings are different
 */
export const isUpdateDataDifferent = (data1, data2) => {
    return data1 !== data2
}