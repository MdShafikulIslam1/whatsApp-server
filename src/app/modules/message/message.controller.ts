import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MessageService } from './message.service';

const addMessage = catchAsync(async (req, res) => {
  console.log('message body: ', req.body);
  const result = await MessageService.addMessage(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Message added successfully',
    success: true,
    data: result,
  });
});

export const MessageController = {
  addMessage,
};
