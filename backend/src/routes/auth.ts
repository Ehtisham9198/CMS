import {Router} from "express";
import { getSession } from "../controllers/auth";

const authRouter = Router();

authRouter.get("/get-session", getSession);

export default authRouter;
