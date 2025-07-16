import express from 'express';
import { userRegister, userLogin, userLogout } from '../routerController/userRoutController.js';

const rout = express.Router();

rout.post('/register',userRegister)

rout.post('/login',userLogin)

rout.post('/logout',userLogout)

export default rout;
