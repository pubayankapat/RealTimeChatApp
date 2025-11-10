import express from 'express';
import isLogin from '../middlewire/isLogin.js';
import createGroup from '../routerController/groupRoutController.js';

const groupRout = express.Router();

groupRout.post('/create', isLogin, createGroup)

export default groupRout;
