import express from 'express';
import { addComment, getComments,addCommentOnShare } from '../controller/commentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/add', authMiddleware,addComment);
router.post('/add/onshared',addCommentOnShare);  
router.get('/get/:pdfId', authMiddleware,getComments); 
router.get('/get/:token/:pdfId',getComments);  

export default router;
