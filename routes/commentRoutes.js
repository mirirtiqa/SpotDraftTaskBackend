import express from 'express';
import { addComment, getComments } from '../controllers/commentController.js';
const router = express.Router();

router.post('add/public/:pdfId', addComment);  
router.get('get/public/:pdfId', getComments);   

export default router;
