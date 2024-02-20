import express, { NextFunction, Request, Response } from 'express';

import router from './app/routes';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/gobalErrorHandler';
import config from './config';
const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', config.access_frontend_url); // Adjust the origin based on your client's URL
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});
//parser

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'WhatsApp application server running successfully',
  });
});
app.use('/api/v1', router);
app.use(globalErrorHandler);

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
