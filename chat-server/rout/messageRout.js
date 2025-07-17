import express from "express";
import { getMessage, sendMessage } from "../routerController/messageRoutController.js";
import isLogin from "../middlewire/isLogin.js";

const messageRout = express.Router();

messageRout.post('/send/:id',isLogin,sendMessage);

messageRout.get('/:id',isLogin,getMessage);

export default messageRout