import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';

const createAccount = catchAsync(async (req, res) => {
  const user = await AuthService.createAccount(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Account created successfully',
    data: user,
  });
});

const login = catchAsync(async (req, res) => {
  const token = await AuthService.login(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Login successful',
    data: token,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await AuthService.getAllUser();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Retrieve All Users',
    success: true,
    data: result,
  });
});

const getSingleUserById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AuthService.getSingleUserById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Retrieve Single User',
    success: true,
    data: result,
  });
});

export const AuthController = {
  createAccount,
  login,
  getAllUser,
  getSingleUserById,
};
