/* eslint-disable no-console */
import http from 'http';
import app from './app';
import config from './config';
import { Server } from 'socket.io';
export const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

export const getReceiverSocketId = (receiverId: string) => {
  return userSoketMap[receiverId];
};

const userSoketMap: { [userId: string]: string } = {}; // {userId: soketID}

io.on('connection', soket => {
  console.log('a user connected', soket.id);
  const userId: string | undefined = soket.handshake.query.userId as
    | string
    | undefined;

  if (userId !== undefined) {
    userSoketMap[userId] = soket.id;
  }
  // io.emit() is used to send events to all the connected clients
  io.emit('getOnlineUsers', Object.keys(userSoketMap));

  console.log('the active user', userId);

  // soket.on() is used to listen to the events. can be used both on client and server side
  soket.on('disconnect', () => {
    console.log('user disconnected', soket.id);
    delete userSoketMap[userId as string];
    io.emit('getOnlineUsers', Object.keys(userSoketMap));
  });
});
async function bootstrap() {
  try {
    server.listen(config.port, () => {
      console.log(
        `Express Backend Setup Application listening on port ${config.port}`
      );
    });
  } catch (error) {
    console.error('Failed to connect', error);
  }
}

bootstrap();
