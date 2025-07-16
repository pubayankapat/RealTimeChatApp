import express from 'express';
import { userRegister, userLogin, userLogout } from '../routerController/userRoutController.js';

const authRout = express.Router();

authRout.post('/register',userRegister)

authRout.post('/login',userLogin)

authRout.post('/logout',userLogout)

export default authRout;
