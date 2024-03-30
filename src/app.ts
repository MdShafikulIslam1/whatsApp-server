/* eslint-disable no-console */
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import httpStatus from 'http-status';
import { Server } from 'socket.io';
import globalErrorHandler from './app/middlewares/gobalErrorHandler';
import router from './app/routes';

const app = express();

export const server = http.createServer(app);

const frontendUrl: string = process.env.ACCESS_FRONTEND_URL as string;

app.use(
  cors({
    origin: [frontendUrl, 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// socket creation

export const io = new Server(server, {
  cors: {
    origin: [frontendUrl, 'http://localhost:3000'],
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

const userSocketMap: { [userId: string]: string } = {}; // {userId: socketID}

export const getReceiverSocketId = (receiverId: string) => {
  return userSocketMap[receiverId];
};

io.on('connection', socket => {
  console.log('a user connected', socket.id);
  const userId: string | undefined = socket.handshake.query.userId as
    | string
    | undefined;

  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }
  // io.emit() is used to send events to all the connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  console.log('the active user', userId);

  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    delete userSocketMap[userId as string];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
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
