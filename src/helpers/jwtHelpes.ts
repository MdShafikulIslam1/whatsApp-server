import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
const createToken = (
  payload: Record<string, unknown>,
  secretKey: Secret,
  expiresTime: string
): string => {
  return jwt.sign(payload, secretKey, { expiresIn: expiresTime });
};

const verifyToken = (token: string, secretKey: Secret): JwtPayload => {
  return jwt.verify(token, secretKey) as JwtPayload;
};
export const JwtHelpers = {
  createToken,
  verifyToken,
};
