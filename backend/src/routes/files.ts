import { Router } from "express";
import { getActions, getFile, getFiles, getInitiatedFiles, getRecievedFiles, getTrack } from "../controllers/files";
import { isAuthenticated } from "../middlewares/auth";
const fileRouter = Router();


fileRouter.get('/track/:id', getTrack);
fileRouter.get('/get_files', getFiles);
fileRouter.get('/file/:id', isAuthenticated, getFile);
fileRouter.get('/recievedFile', getRecievedFiles);
fileRouter.post('/file_forward', getActions);
fileRouter.post('/initiate_file', getInitiatedFiles);




export default fileRouter;

