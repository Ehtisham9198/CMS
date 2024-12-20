import {Router} from "express";
import { changedPassward, createUser, getAllDesignations, getMylDesignations } from "../controllers/user";
import { isAuthenticated } from "../middlewares/auth";

const userRounter = Router();

userRounter.post("/CreateUser", createUser);
userRounter.post("/ChangePassword", changedPassward);
userRounter.get("/user/designations", getAllDesignations);
userRounter.get("/user/my-designations", isAuthenticated, getMylDesignations);

export default userRounter;
