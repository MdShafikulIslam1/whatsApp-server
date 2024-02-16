"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleClientKnownError = (error) => {
    var _a;
    let message = '';
    let errors = [];
    if (error.code === 'P2025') {
        message = ((_a = error.meta) === null || _a === void 0 ? void 0 : _a.cause) || 'Record not found';
        errors = [
            {
                path: '',
                message,
            },
        ];
    }
    else if (error.code === 'P2003') {
        if (error.message.includes('delete()`invocation():')) {
            message = 'Delete failed for Constraint';
            errors = [
                {
                    path: '',
                    message,
                },
            ];
        }
    }
    return {
        statusCode: http_status_1.default.BAD_REQUEST,
        message,
        errorMessages: errors,
    };
};
exports.default = handleClientKnownError;
