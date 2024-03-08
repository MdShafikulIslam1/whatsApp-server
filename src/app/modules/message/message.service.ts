/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import prisma from '../../../shared/prisma';
import { getReceiverSocketId, io } from '../../../server';

const addMessage = async (payload: {
  message: string;
  from: string;
  to: string;
  type: string;
}) => {
  const { message, from, to } = payload;
  if (!message || !from || !to) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Message or from or to not found.'
    );
  }
  const result = await prisma.message.create({
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

  const receiverSocketId = getReceiverSocketId(to as string);
  if (receiverSocketId) {
    // emit soket event
    io.to(receiverSocketId).emit('new_message', result);
  }

  return result;
};

const getMessages = async (from: string, to: string) => {
  if (!from || !to) {
    throw new ApiError(httpStatus.NOT_FOUND, 'sender or receiver not found');
  }
  const messages = await prisma.message.findMany({
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
  const unreadMessages: any = [];
  messages.forEach((message, index) => {
    if (message?.messageStatus !== 'read' && message?.senderId === to) {
      messages[index].messageStatus = 'read';
      unreadMessages.push(message?.id);
    }
  });
  await prisma.message.updateMany({
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
};

//get initialContactsWithUnreadMessages

export const getInitialContactsWithMessages = async (userId: string) => {
  console.log('user id pawa jacce', userId);
  if (!userId) {
    return [];
  }
  const isExistUser = await prisma.user.findUnique({
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
  console.log('isExist', isExistUser);
  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const messages = [
    ...isExistUser.sentMessages,
    ...isExistUser.receivedMessages,
  ];

  messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const users = new Map();

  const messageStatusChange: any = [];

  messages.forEach(msg => {
    const isSender = msg?.senderId === userId;

    const calculatedId = isSender ? msg?.receiverId : msg?.senderId;
    if (msg?.messageStatus === 'sent') {
      messageStatusChange.push(msg?.id);
    }
    if (!users.get(calculatedId)) {
      const {
        id,
        type,
        message,
        messageStatus,
        createdAt,
        senderId,
        receiverId,
      } = msg;
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
        user = {
          ...user,
          ...msg?.receiver,
          totalUnreadMessage: 0,
        };
      } else {
        user = {
          ...user,
          ...msg?.sender,
          totalUnreadMessage: messageStatus !== 'read' ? 1 : 0,
        };
      }

      users.set(calculatedId, { ...user });
    } else if (msg?.messageStatus !== 'read' && !isSender) {
      const user = users.get(calculatedId);
      users.set(calculatedId, {
        ...user,
        totalUnreadMessage: user.totalUnreadMessage + 1,
      });
    }
  });

  if (messageStatusChange.length) {
    await prisma.message.updateMany({
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
};

export const MessageService = {
  addMessage,
  getMessages,
  getInitialContactsWithMessages,
};
