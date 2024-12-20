import { Router } from "express";
import multer from "multer";
import { generateFilePDF, getActions, getEditFile, getFile, getfileById, getFiles, getInitiateFiles, getMyInitiatedFiles, getReceivedFiles, getTrack } from "../controllers/files";
import { isAuthenticated } from "../middlewares/auth";
const fileRouter = Router();
const upload = multer({ dest: "uploads/" });


fileRouter.get('/track/:id', getTrack);
fileRouter.get('/get_files', getFiles);
fileRouter.get('/file/:id', isAuthenticated, getFile);
fileRouter.get('/MyInitiatesFiles', getMyInitiatedFiles);  //lagana h isko
fileRouter.post('/file_forward', getActions);
fileRouter.post('/initiate_file', upload.single("file"), getInitiateFiles);
fileRouter.get('/ReceivedFiles', getReceivedFiles);
fileRouter.put('/initiate_file', upload.single("file"), getEditFile);
fileRouter.get('/fileById', getfileById);
fileRouter.get('/files/:id/generate-pdf', generateFilePDF);







export default fileRouter;

