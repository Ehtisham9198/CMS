import {Router} from "express";
import { getCheckedSession, getSession } from "../controllers/auth";



const authRouter = Router();

authRouter.get("/get-session", getSession);
authRouter.get("/checksession", getCheckedSession);


export default authRouter;
