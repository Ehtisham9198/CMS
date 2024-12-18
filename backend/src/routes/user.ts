import {Router} from "express";
import { changedPassward, createUser, getAllDesignations } from "../controllers/user";

const userRounter = Router();

userRounter.post("/CreateUser", createUser);
userRounter.post("/ChangePassword", changedPassward);
userRounter.get("/user/designations", getAllDesignations);

export default userRounter;
