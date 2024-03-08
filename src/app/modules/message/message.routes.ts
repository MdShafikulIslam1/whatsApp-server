import { Router } from 'express';
import { MessageController } from './message.controller';

const router = Router();

router.get(
  '/getInitialContacts/:from',
  MessageController.getInitialContactsWithMessages
);

router.get('/:from/:to', MessageController.getMessages);

router.post('/add-message', MessageController.addMessage);

export const MessageRouter = router;
