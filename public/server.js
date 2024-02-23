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
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const socket_io_1 = require("socket.io");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const server = http_1.default.createServer(app_1.default); // Creating an HTTP server instance using Express app
            const io = new socket_io_1.Server(server, {
                cors: {
                    origin: 'http://localhost:3000',
                    credentials: true,
                },
            }); // Attaching socket.io to the HTTP server
            const onlineUsers = new Map(); // Map to store online users and their sockets
            io.on('connection', (socket) => {
                console.log('A user connected');
                socket.on('add-user', (userId) => {
                    console.log('User added:', userId);
                    onlineUsers.set(userId, socket.id);
                    broadcastOnlineUsers();
                });
                socket.on('sign-out', (userId) => {
                    console.log('User signed out:', userId);
                    onlineUsers.delete(userId);
                    broadcastOnlineUsers();
                });
                socket.on('disconnect', () => {
                    console.log('A user disconnected');
                    // Remove the user from the onlineUsers map
                    for (const [key, value] of onlineUsers.entries()) {
                        if (value === socket.id) {
                            onlineUsers.delete(key);
                            broadcastOnlineUsers();
                            break;
                        }
                    }
                });
                socket.on('send-message', (data) => {
                    console.log('Message received:', data);
                    const sendUserSocket = onlineUsers.get(data === null || data === void 0 ? void 0 : data.to);
                    console.log('Send user socket:', sendUserSocket);
                    socket.emit('received-message', 'I want to learn socket from kamrul vai and masum rana vai');
                    // if (sendUserSocket) {
                    //   io.to(sendUserSocket).emit('received-message', {
                    //     from: data.from,
                    //     message: data?.message,
                    //   });
                    // }
                });
                function broadcastOnlineUsers() {
                    io.emit('online-users', {
                        onlineUsers: Array.from(onlineUsers.keys()),
                    });
                }
            });
            server.listen(config_1.default.port, () => {
                console.log(`Express Backend Setup Application listening on port ${config_1.default.port}`);
            });
        }
        catch (error) {
            console.error('Failed to connect', error);
        }
    });
}
bootstrap();
