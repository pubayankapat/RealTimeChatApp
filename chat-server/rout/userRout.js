import express from "express"
import isLogin from "../middlewire/isLogin.js";
import { getUserBySearch, getCurrentChatters } from "../routerController/userHandlerRout.js";

const userRout = express.Router();

userRout.get('/search',isLogin,getUserBySearch);
userRout.get('/currentchatters',isLogin,getCurrentChatters);

export default userRout;