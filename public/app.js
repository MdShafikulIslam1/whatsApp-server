"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./app/routes"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const gobalErrorHandler_1 = __importDefault(require("./app/middlewares/gobalErrorHandler"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'https://whats-app-clone-frontend-pi.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/v1', routes_1.default);
app.use(gobalErrorHandler_1.default);
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'WhatsApp application server running successfully',
    });
});
// Handle 404
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
