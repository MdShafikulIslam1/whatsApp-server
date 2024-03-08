import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import prisma from '../../../shared/prisma';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';

import { Secret } from 'jsonwebtoken';
import { JwtHelpers } from '../../../helpers/jwtHelpes';
import config from '../../../config';

const createAccount = async (data: User): Promise<User | null> => {
  const { password } = data;
  const hashedPassword = await bcrypt.hash(password, 12);
  const result = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
  return result;
};

const login = async (payload: {
  email: string;
  password: string;
}): Promise<string> => {
  const isUserExist = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (
    isUserExist.password &&
    !(await bcrypt.compare(payload.password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token & refresh token

  const { id, email } = isUserExist;

  const accessToken = JwtHelpers.createToken(
    { id, email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return accessToken;
};

const getSingleUserById = async (id: string) => {
  const isExistUser = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return isExistUser;
};

const getAllUser = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const usersGroupByInitialLetter: any = {};

  users?.forEach(user => {
    const initialLetter = user?.name?.charAt(0).toUpperCase();
    if (!usersGroupByInitialLetter[initialLetter]) {
      usersGroupByInitialLetter[initialLetter] = [];
    }
    usersGroupByInitialLetter[initialLetter].push(user);
  });
  return usersGroupByInitialLetter;
};

export const AuthService = {
  createAccount,
  login,
  getAllUser,
  getSingleUserById,
};
