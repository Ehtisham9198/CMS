import { Router } from "express";
import multer from "multer";
import {getEditFile, getFile, getfileById, getFiles, getInitiateFiles, getReceivedFiles, getTrack, getTrackedMyFile } from "../controllers/files";
import { isAuthenticated } from "../middlewares/auth";
import { generateFilePDF } from "../controllers/generatePDF";
import { getActions } from "../controllers/fileAction";
const fileRouter = Router();
const upload = multer({ dest: "uploads/" });


fileRouter.get('/track/:id', getTrack);
fileRouter.get('/get_files', getFiles);
fileRouter.get('/file/:id', isAuthenticated, getFile);
fileRouter.post('/file_forward',upload.single("file"), getActions);
fileRouter.post('/initiate_file', upload.single("file"), getInitiateFiles);
fileRouter.get('/ReceivedFiles', getReceivedFiles);
fileRouter.put('/initiate_file', upload.single("file"), getEditFile);
fileRouter.get('/fileById', getfileById);
fileRouter.get('/files/:id/generate-pdf', generateFilePDF);
fileRouter.get('/trackMyFile', isAuthenticated, getTrackedMyFile);







export default fileRouter;

