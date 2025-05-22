import express from 'express';
import { addComment, getComments } from '../controller/commentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/add', authMiddleware,addComment);  
router.get('/get/:pdfId', authMiddleware,getComments);   

export default router;
