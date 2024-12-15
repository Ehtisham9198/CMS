import {Router} from "express";
import { getFiles, getTrack } from "../controllers/file";
const fileRouter = Router();


fileRouter.get('/track/:id',getTrack);
fileRouter.get('/get_files',getFiles);



export default fileRouter;

