import { Router } from 'express';
import { AuthRouter } from '../modules/auth/auth.routes';
import { MessageRouter } from '../modules/message/message.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/messages',
    route: MessageRouter,
  },
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
