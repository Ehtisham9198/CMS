import {Router} from "express";
import { getActions, getFiles, getInitiatedFiles, getRecievedFiles, getTrack } from "../controllers/files";
const fileRouter = Router();


fileRouter.get('/track/:id',getTrack);
fileRouter.get('/get_files',getFiles);
fileRouter.get('/recievedFile',getRecievedFiles);
fileRouter.post('/file_actions',getActions);
fileRouter.post('/initiate_file',getInitiatedFiles);




export default fileRouter;

