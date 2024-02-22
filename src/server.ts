/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import http from 'http';
import app from './app';
import config from './config';
import { Server, Socket } from 'socket.io';

async function bootstrap() {
  try {
    const server = http.createServer(app); // Creating an HTTP server instance using Express app

    const io = new Server(server, {
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    }); // Attaching socket.io to the HTTP server

    const onlineUsers = new Map<string, string>(); // Map to store online users and their sockets

    io.on('connection', (socket: Socket) => {
      console.log('A user connected');

      socket.on('add-user', (userId: string) => {
        console.log('User added:', userId);
        onlineUsers.set(userId, socket.id);
        broadcastOnlineUsers();
      });

      socket.on('sign-out', (userId: string) => {
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

      socket.on('send-message', (data: any) => {
        console.log('Message received:', data);
        const sendUserSocket = onlineUsers.get(data?.to);
        console.log('Send user socket:', sendUserSocket);

        socket.emit(
          'received-message',
          'I want to learn socket from kamrul vai and masum rana vai'
        );

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
