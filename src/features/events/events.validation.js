function validateEventData(data, rowNumber) {
    const requiredFields = ["name", "date", "location"];
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === "") {
            return {
                row: rowNumber,
                message: `Missing required field: ${field}`,
            };
        }
    }

    if (data.date && !/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/.test(data.date)) {
        return {
            row: rowNumber,
            message: "Invalid date format. Use YYYY-MM-DD or YYYY-MM-DDThh:mm:ss",
        };
    }

    return null;
}

module.exports = { validateEventData };