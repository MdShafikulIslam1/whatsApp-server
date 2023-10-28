import { Prisma } from '@prisma/client';
import { IGenericErrorResponse } from '../interfaces/common';
const handleValidationError = (
  err: Prisma.PrismaClientValidationError
): IGenericErrorResponse => {
  const errors = [
    {
      path: '',
      message: err.message,
    },
  ];

  return {
    statusCode: 500,
    message: 'ValidationError',
    errorMessages: errors,
  };
};

export default handleValidationError;
