"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./app/routes"));
const http_status_1 = __importDefault(require("http-status"));
const gobalErrorHandler_1 = __importDefault(require("./app/middlewares/gobalErrorHandler"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', config_1.default.access_frontend_url ||
        'https://whats-app-clone-frontend-pi.vercel.app'); // Adjust the origin based on your client's URL
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'WhatsApp application server running successfully',
    });
});
app.use('/api/v1', routes_1.default);
app.use(gobalErrorHandler_1.default);
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'Not Found',
        errorMessages: {
            path: req.originalUrl,
            message: 'Not Found',
        },
    });
    next();
});
exports.default = app;
