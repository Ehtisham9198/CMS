import { Router } from "express";
import { getActions, getEditFile, getFile, getfileById, getFiles, getInitiateFiles, getMyInitiatedFiles, getReceivedFiles, getTrack } from "../controllers/files";
import { isAuthenticated } from "../middlewares/auth";
const fileRouter = Router();


fileRouter.get('/track/:id', getTrack);
fileRouter.get('/get_files', getFiles);
fileRouter.get('/file/:id', isAuthenticated, getFile);
fileRouter.get('/MyInitiatesFiles', getMyInitiatedFiles);  //lagana h isko
fileRouter.post('/file_forward', getActions);
fileRouter.post('/initiate_file', getInitiateFiles);
fileRouter.get('/ReceivedFiles', getReceivedFiles);
fileRouter.put('/initiate_file', getEditFile);
fileRouter.get('/fileById', getfileById);






export default fileRouter;

