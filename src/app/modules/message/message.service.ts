/* eslint-disable @typescript-eslint/no-explicit-any */
// messageService.ts
import prisma from '../../../shared/prisma';

// Access global variable
// eslint-disable-next-line no-undef
const onlineUsersMap: Map<any, any> = (global as any).onlineUsers;

const addMessage = async (payload: {
  message: string;
  from: string;
  to: string;
}) => {
  const { message, from, to } = payload;
  if (!message || !from || !to) {
    return 'Message or from or to not found.';
  }
  const getUser = onlineUsersMap?.get(to);
  console.log('online user: ', getUser);
  const result = await prisma.message.create({
    data: {
      message,
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

export const MessageService = {
  addMessage,
};
