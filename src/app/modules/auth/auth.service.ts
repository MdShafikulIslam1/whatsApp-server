import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import prisma from '../../../shared/prisma';

const checkUser = async (email: string) => {
  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Email is required');
  }
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  return isUserExist;
};

const onboardUser = async (payload: {
  name: string;
  email: string;
  about: string;
  profilePhoto: string;
}) => {
  const { name, email, about, profilePhoto } = payload;
  if (!email || !name || !about || !profilePhoto) {
    throw new ApiError(
      httpStatus.NO_CONTENT,
      'Name,Email,About and Profile Photo must be provided'
    );
  }
  const result = await prisma.user.create({
    data: { name, email, about, profilePhoto },
  });

  return result;
};

export const AuthService = {
  checkUser,
  onboardUser,
};
