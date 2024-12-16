import { Router } from "express";
import { getActions, getFile, getFiles, getInitiateFiles, getMyInitiatedFiles, getReceivedFiles, getTrack } from "../controllers/files";
import { isAuthenticated } from "../middlewares/auth";
const fileRouter = Router();


fileRouter.get('/track/:id', getTrack);
fileRouter.get('/get_files', getFiles);
fileRouter.get('/file/:id', isAuthenticated, getFile);
fileRouter.get('/MyInitiatesFiles', getMyInitiatedFiles);  //lagana h isko
fileRouter.post('/file_forward', getActions);
fileRouter.post('/initiate_file', getInitiateFiles);
fileRouter.get('/ReceivedFiles', getReceivedFiles);




export default fileRouter;

