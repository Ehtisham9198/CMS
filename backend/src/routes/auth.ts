import { Router } from "express";
import { changeDesignation, getSession, login, logout } from "../controllers/auth";
import { isAuthenticated } from "../middlewares/auth";

const authRouter = Router();

authRouter.get("/get-session", getSession);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/change-designation", isAuthenticated, changeDesignation);

export default authRouter;
