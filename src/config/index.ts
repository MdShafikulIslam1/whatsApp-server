import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });
export default {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  access_frontend_url: process.env.ACCESS_FRONTEND_URL as string,
};
