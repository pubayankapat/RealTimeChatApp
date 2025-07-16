import express from "express";
import { sendMessage } from "../routerController/messageRoutController.js";

const messageRout = express.Router();

messageRout.post('/send/:id',sendMessage);

export default messageRout