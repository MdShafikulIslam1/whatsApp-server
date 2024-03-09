import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();

router.get('/all-user', AuthController.getAllUser);

router.get('/:id', AuthController.getSingleUserById);

router.post('/login', AuthController.login);

router.post('/create-account', AuthController.createAccount);

export const AuthRouter = router;
