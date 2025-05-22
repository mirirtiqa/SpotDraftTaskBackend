import express from 'express';
import { addComment, getComments } from '../controller/commentController.js';
const router = express.Router();

router.post('add/public/:pdfId', addComment);  
router.get('get/public/:pdfId', getComments);   

export default router;
