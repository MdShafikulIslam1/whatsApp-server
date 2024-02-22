/* eslint-disable @typescript-eslint/no-explicit-any */
// messageService.ts
import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import prisma from '../../../shared/prisma';

// Access global variable
// eslint-disable-next-line no-undef
const onlineUsersMap: Map<any, any> = (global as any).onlineUsers;

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
  const getUser = onlineUsersMap?.get(to);
  const result = await prisma.message.create({
    data: {
      message,
      type: payload.type,
      messageStatus: getUser ? 'delivered' : 'sent',
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

export const MessageService = {
  addMessage,
  getMessages,
};
