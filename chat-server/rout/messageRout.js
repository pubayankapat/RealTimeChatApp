import express from "express";
import { getMessage, sendMessage, sendMessageToGroup } from "../routerController/messageRoutController.js";
import isLogin from "../middlewire/isLogin.js";

const messageRout = express.Router();

messageRout.post('/send/:id',isLogin,sendMessage);

messageRout.get('/:id',isLogin,getMessage);

messageRout.post('/sendMessageToGroup',isLogin,sendMessageToGroup);

export default messageRout