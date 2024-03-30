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
exports.MessageService = exports.getInitialContactsWithMessages = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const app_1 = require("../../../app");
const ApiError_1 = __importDefault(require("../../../error/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const addMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, from, to } = payload;
    if (!message || !from || !to) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Message or from or to not found.');
    }
    const result = yield prisma_1.default.message.create({
        data: {
            message,
            type: payload.type,
            sender: {
                connect: {
                    id: from,
                },
            },
            receiver: {
                connect: {
                    id: to,
                },
            },
        },
        include: {
            sender: true,
            receiver: true,
        },
    });
    const receiverSocketId = (0, app_1.getReceiverSocketId)(to);
    if (receiverSocketId) {
        app_1.io.to(receiverSocketId).emit('new_message', result);
    }
    return result;
});
const getMessages = (from, to) => __awaiter(void 0, void 0, void 0, function* () {
    if (!from || !to) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'sender or receiver not found');
    }
    const messages = yield prisma_1.default.message.findMany({
        where: {
            OR: [
                {
                    senderId: from,
                    receiverId: to,
                },
                {
                    senderId: to,
                    receiverId: from,
                },
            ],
        },
        orderBy: {
            createdAt: 'asc',
        },
    });
    const unreadMessages = [];
    messages.forEach((message, index) => {
        if ((message === null || message === void 0 ? void 0 : message.messageStatus) !== 'read' && (message === null || message === void 0 ? void 0 : message.senderId) === to) {
            messages[index].messageStatus = 'read';
            unreadMessages.push(message === null || message === void 0 ? void 0 : message.id);
        }
    });
    yield prisma_1.default.message.updateMany({
        where: {
            id: {
                in: unreadMessages,
            },
        },
        data: {
            messageStatus: 'read',
        },
    });
    return messages;
});
//get initialContactsWithUnreadMessages
const getInitialContactsWithMessages = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        return [];
    }
    const isExistUser = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        include: {
            sentMessages: {
                include: {
                    sender: true,
                    receiver: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
            receivedMessages: {
                include: {
                    sender: true,
                    receiver: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const messages = [
        ...isExistUser.sentMessages,
        ...isExistUser.receivedMessages,
    ];
    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const users = new Map();
    const messageStatusChange = [];
    messages.forEach(msg => {
        const isSender = (msg === null || msg === void 0 ? void 0 : msg.senderId) === userId;
        const calculatedId = isSender ? msg === null || msg === void 0 ? void 0 : msg.receiverId : msg === null || msg === void 0 ? void 0 : msg.senderId;
        if ((msg === null || msg === void 0 ? void 0 : msg.messageStatus) === 'sent') {
            messageStatusChange.push(msg === null || msg === void 0 ? void 0 : msg.id);
        }
        if (!users.get(calculatedId)) {
            const { id, type, message, messageStatus, createdAt, senderId, receiverId, } = msg;
            let user = {
                messageId: id,
                type,
                message,
                messageStatus,
                createdAt,
                senderId,
                receiverId,
                totalUnreadMessage: 0,
            };
            if (isSender) {
                user = Object.assign(Object.assign(Object.assign({}, user), msg === null || msg === void 0 ? void 0 : msg.receiver), { totalUnreadMessage: 0 });
            }
            else {
                user = Object.assign(Object.assign(Object.assign({}, user), msg === null || msg === void 0 ? void 0 : msg.sender), { totalUnreadMessage: messageStatus !== 'read' ? 1 : 0 });
            }
            users.set(calculatedId, Object.assign({}, user));
        }
        else if ((msg === null || msg === void 0 ? void 0 : msg.messageStatus) !== 'read' && !isSender) {
            const user = users.get(calculatedId);
            users.set(calculatedId, Object.assign(Object.assign({}, user), { totalUnreadMessage: user.totalUnreadMessage + 1 }));
        }
    });
    if (messageStatusChange.length) {
        yield prisma_1.default.message.updateMany({
            where: {
                id: {
                    in: messageStatusChange,
                },
            },
            data: {
                messageStatus: 'delivered',
            },
        });
    }
    return {
        users: Array.from(users.values()),
    };
});
exports.getInitialContactsWithMessages = getInitialContactsWithMessages;
exports.MessageService = {
    addMessage,
    getMessages,
    getInitialContactsWithMessages: exports.getInitialContactsWithMessages,
};
