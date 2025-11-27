import express from 'express';
import { userRegister, userLogin, userLogout, userProfile, updateImage } from '../routerController/userRoutController.js';
import isLogin from '../middlewire/isLogin.js';

const authRout = express.Router();

authRout.post('/register', userRegister)

authRout.post('/login', userLogin)

authRout.post('/logout', userLogout)

authRout.get('/profile', isLogin, userProfile)

authRout.post('/updateImage', isLogin, updateImage)

export default authRout;
