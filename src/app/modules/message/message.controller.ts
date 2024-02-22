import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MessageService } from './message.service';

const addMessage = catchAsync(async (req, res) => {
  const result = await MessageService.addMessage(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Message added successfully',
    success: true,
    data: result,
  });
});

const getMessages = catchAsync(async (req, res) => {
  const { from, to } = req.params;
  const result = await MessageService.getMessages(from, to);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Get Messages',
    success: true,
    data: result,
  });
});

const getInitialContactsWithMessages = catchAsync(async (req, res) => {
  const { from } = req.params;
  const result = await MessageService.getInitialContactsWithMessages(from);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Get initial contacts with unread messages',
    success: true,
    data: result,
  });
});

export const MessageController = {
  addMessage,
  getMessages,
  getInitialContactsWithMessages,
};
