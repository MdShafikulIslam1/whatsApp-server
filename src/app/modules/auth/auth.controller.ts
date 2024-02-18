import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';

const checkUser = catchAsync(async (req, res) => {
  const result = await AuthService.checkUser(req.body.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User already exists',
    success: true,
    data: result,
  });
});

const onboardUser = catchAsync(async (req, res) => {
  const result = await AuthService.onboardUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User created successfully',
    success: true,
    data: result,
  });
});

export const AuthController = {
  checkUser,
  onboardUser,
};
