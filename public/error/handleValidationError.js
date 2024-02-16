"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (err) => {
    const errors = [
        {
            path: '',
            message: err.message,
        },
    ];
    return {
        statusCode: 500,
        message: 'ValidationError',
        errorMessages: errors,
    };
};
exports.default = handleValidationError;
