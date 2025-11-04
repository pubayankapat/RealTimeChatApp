import express from "express";
import { getS3Url } from "../routerController/uploadItemController.js";
import isLogin from "../middlewire/isLogin.js";

const uploadRouter = express.Router();

uploadRouter.get("/presign", isLogin, getS3Url);

export default uploadRouter;