import express from "express";
import { getS3Url, getDeleteSignedUrl } from "../routerController/uploadItemController.js";
import isLogin from "../middlewire/isLogin.js";

const uploadRouter = express.Router();

uploadRouter.get("/presign", isLogin, getS3Url);
uploadRouter.post("/presign/delete", isLogin, getDeleteSignedUrl);

export default uploadRouter;