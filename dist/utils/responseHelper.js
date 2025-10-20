"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, message, data, statusCode = 200) => {
    const response = {
        success: true,
        message,
        data,
    };
    res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, error, statusCode = 500) => {
    const response = {
        success: false,
        message,
        error: error?.message || error,
    };
    res.status(statusCode).json(response);
};
exports.sendError = sendError;
//# sourceMappingURL=responseHelper.js.map