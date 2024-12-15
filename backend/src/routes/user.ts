import {Router} from "express";
import { getChangedPassward, getCreateUser, getLogin, getLogout } from "../controllers/auth";

const userRounter = Router();


userRounter.post("/CreateUser", getCreateUser);
userRounter.get("/login", getLogin);
userRounter.post("/ChangePassword", getChangedPassward);
userRounter.get("/logout", getLogout);

export default userRounter;