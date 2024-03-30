import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();

// POST requests
router.post('/login', AuthController.login);
router.post('/create-account', AuthController.createAccount);

// GET requests
router.get('/all-user', AuthController.getAllUser);
router.get('/:id', AuthController.getSingleUserById);

export const AuthRouter = router;
