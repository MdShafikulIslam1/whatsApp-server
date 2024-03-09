"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiverSocketId = exports.io = exports.server = void 0;
/* eslint-disable no-console */
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const socket_io_1 = require("socket.io");
exports.server = http_1.default.createServer(app_1.default);
exports.io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST'],
    },
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
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            exports.server.listen(config_1.default.port, () => {
                console.log(`Express Backend Setup Application listening on port ${config_1.default.port}`);
            });
        }
        catch (error) {
            console.error('Failed to connect', error);
        }
    });
}
bootstrap();
