import { Router } from 'express';
import { MessageController } from './message.controller';

const router = Router();

router.post('/add-message', MessageController.addMessage);

export const MessageRouter = router;
