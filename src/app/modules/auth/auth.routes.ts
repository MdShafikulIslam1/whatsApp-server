import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();

router.post('/check-user', AuthController.checkUser);

router.post('/onboard-user', AuthController.onboardUser);

router.get('/all-user', AuthController.getAllUser);

export const AuthRouter = router;
