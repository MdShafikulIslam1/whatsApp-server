/* eslint-disable @typescript-eslint/no-explicit-any */
// app.ts
import express, { NextFunction, Request, Response } from 'express';
import router from './app/routes';
import cors from 'cors';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/gobalErrorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);
app.use(globalErrorHandler);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'WhatsApp application server running successfully',
  });
});

// eslint-disable-next-line no-undef
(global as any).onlineUsers = new Map<any, any>();

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
