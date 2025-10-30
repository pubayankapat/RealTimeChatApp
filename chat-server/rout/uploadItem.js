import express from "express";
import isLogin  from "../middlewire/isLogin.js";
import { getS3Url } from "../routerController/uploadItemController.js";

const uploadRouter = express.Router();

uploadRouter.get("/presign", isLogin, getS3Url);

export default uploadRouter;