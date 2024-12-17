import {Router} from "express";
import { getChangedPassward, getCreateUser, getLogin, getLogout } from "../controllers/auth";

const userRounter = Router();


userRounter.post("/CreateUser", getCreateUser);
userRounter.post("/login", getLogin);
userRounter.post("/ChangePassword", getChangedPassward);
userRounter.post("/logout", getLogout);

export default userRounter;