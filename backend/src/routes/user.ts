import {Router} from "express";
import { changedPassward, createUser } from "../controllers/user";

const userRounter = Router();

userRounter.post("/CreateUser", createUser);
userRounter.post("/ChangePassword", changedPassward);

export default userRounter;
