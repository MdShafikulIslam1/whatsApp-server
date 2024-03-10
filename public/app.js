"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiverSocketId = exports.io = exports.server = void 0;
/* eslint-disable no-console */
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./app/routes"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const gobalErrorHandler_1 = __importDefault(require("./app/middlewares/gobalErrorHandler"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
exports.server = http_1.default.createServer(app);
app.use((0, cors_1.default)({
    origin: [
        'https://whats-app-clone-frontend-pi.vercel.app',
        'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// socket creation
exports.io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: [
            'https://whats-app-clone-frontend-pi.vercel.app',
            'http://localhost:3000',
        ],
        methods: ['GET', 'POST'],
    },
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/v1', routes_1.default);
app.use(gobalErrorHandler_1.default);
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'WhatsApp application server running successfully',
    });
});
const getReceiverSocketId = (receiverId) => {
    return userSoketMap[receiverId];
};
exports.getReceiverSocketId = getReceiverSocketId;
const userSoketMap = {}; // {userId: soketID}
exports.io.on('connection', soket => {
    console.log('a user connected', soket.id);
    const userId = soket.handshake.query.userId;
    if (userId !== undefined) {
        userSoketMap[userId] = soket.id;
    }
    // io.emit() is used to send events to all the connected clients
    exports.io.emit('getOnlineUsers', Object.keys(userSoketMap));
    console.log('the active user', userId);
    // soket.on() is used to listen to the events. can be used both on client and server side
    soket.on('disconnect', () => {
        console.log('user disconnected', soket.id);
        delete userSoketMap[userId];
        exports.io.emit('getOnlineUsers', Object.keys(userSoketMap));
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
