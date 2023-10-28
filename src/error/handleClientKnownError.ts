import { IGenericErrorMessages } from '../interfaces/error';
import { IGenericErrorResponse } from '../interfaces/common';
import httpStatus from 'http-status';
import { Prisma } from '@prisma/client';

const handleClientKnownError = (
  error: Prisma.PrismaClientKnownRequestError
): IGenericErrorResponse => {
  let message = '';
  let errors: IGenericErrorMessages[] = [];
  if (error.code === 'P2025') {
    message = (error.meta?.cause as string) || 'Record not found';
    errors = [
      {
        path: '',
        message,
      },
    ];
  } else if (error.code === 'P2003') {
    if (error.message.includes('delete()`invocation():')) {
      message = 'Delete failed for Constraint';
      errors = [
        {
          path: '',
          message,
        },
      ];
    }
  }

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message,
    errorMessages: errors,
  };
};
export default handleClientKnownError;
