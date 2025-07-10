import express from 'express';
import { getUsersForSidebar,getMessages,markMsgAsSeen, sendMsg } from '../Controllers/msgController.js';
import userAuth from '../Middleware/userAuth.js';

const msgRouter = express.Router();

msgRouter.get('/users',userAuth,getUsersForSidebar);
msgRouter.get('/:id',userAuth,getMessages);
msgRouter.put('/mark/:id',markMsgAsSeen);
msgRouter.post('/send/:id',userAuth,sendMsg);

export default msgRouter;