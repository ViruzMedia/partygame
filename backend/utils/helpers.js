// backend/utils/helpers.js

// Zentrale Fehlerbehandlung
const handleError = (res, error, message = 'Ein Fehler ist aufgetreten') => {
    console.error(message, error);
    res.status(500).json({ message, error: error.message });
};

// Validierung von Pflichtfeldern
const validateRequestBody = (requiredFields, body) => {
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
        return { valid: false, missingFields };
    }
    return { valid: true };
};

module.exports = { handleError, validateRequestBody };