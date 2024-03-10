/* eslint-disable no-console */
import express, { NextFunction, Request, Response } from 'express';
import router from './app/routes';
import cors from 'cors';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/gobalErrorHandler';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

export const server = http.createServer(app);

app.use(
  cors({
    origin: [
      'https://whats-app-clone-frontend-pi.vercel.app',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// socket creation

export const io = new Server(server, {
  cors: {
    origin: [
      'https://whats-app-clone-frontend-pi.vercel.app',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);
app.use(globalErrorHandler);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'WhatsApp application server running successfully',
  });
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

// Handle 404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: {
      path: req.originalUrl,
      message: 'Not Found',
    },
  });
  next();
});

export default app;
