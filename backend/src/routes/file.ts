import {Router} from "express";
import { getActions, getFiles, getInitiatedFiles, getRecievedFiles, getTrack, getTrackedFiles } from "../controllers/file";
const fileRouter = Router();


fileRouter.get('/track/:id',getTrack);
fileRouter.get('/get_files',getFiles);
fileRouter.get('/track/:id',getTrackedFiles);
fileRouter.get('/recievedFile',getRecievedFiles);
fileRouter.get('/file_actions',getActions);
fileRouter.post('/initiate_file',getInitiatedFiles);




export default fileRouter;

