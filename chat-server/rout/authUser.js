import express from 'express';
import { userRegister, userLogin, userLogout, updateImage } from '../routerController/userRoutController.js';
import isLogin from '../middlewire/isLogin.js';

const authRout = express.Router();

authRout.post('/register', userRegister)

authRout.post('/login', userLogin)

authRout.post('/logout', userLogout)

authRout.post('/updateImage', isLogin, updateImage)

export default authRout;
