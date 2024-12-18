import { Router } from "express";
import { getSession, login, logout } from "../controllers/auth";

const authRouter = Router();

authRouter.get("/get-session", getSession);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;
