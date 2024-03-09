"use strict";
/* eslint-disable no-console */
// /* eslint-disable no-console */
// import http from 'http';
// import app from './app';
// import config from './config';
// import { Server } from 'socket.io';
// const server = http.createServer(app);
// export const io = new Server(server, {
//   cors: {
//     origin: [
//       'https://whats-app-clone-frontend-pi.vercel.app',
//       'http://localhost:3000',
//     ],
//     methods: ['GET', 'POST'],
//   },
// });
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
// export const getReceiverSocketId = (receiverId: string) => {
//   return userSoketMap[receiverId];
// };
// const userSoketMap: { [userId: string]: string } = {}; // {userId: soketID}
// io.on('connection', soket => {
//   console.log('a user connected', soket.id);
//   const userId: string | undefined = soket.handshake.query.userId as
//     | string
//     | undefined;
//   if (userId !== undefined) {
//     userSoketMap[userId] = soket.id;
//   }
//   // io.emit() is used to send events to all the connected clients
//   io.emit('getOnlineUsers', Object.keys(userSoketMap));
//   console.log('the active user', userId);
//   // soket.on() is used to listen to the events. can be used both on client and server side
//   soket.on('disconnect', () => {
//     console.log('user disconnected', soket.id);
//     delete userSoketMap[userId as string];
//     io.emit('getOnlineUsers', Object.keys(userSoketMap));
//   });
// });
// import app, { server } from './app';
const app_1 = require("./app");
const config_1 = __importDefault(require("./config"));
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            app_1.server.listen(config_1.default.port, () => {
                console.log(`Express Backend Setup Application listening on port ${config_1.default.port}`);
            });
        }
        catch (error) {
            console.error('Failed to connect', error);
        }
    });
}
bootstrap();
