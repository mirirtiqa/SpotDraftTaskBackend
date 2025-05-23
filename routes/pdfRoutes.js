import express from 'express';
import multer from 'multer';
import { uploadPDF, getPDFs, generateShareLink,viewSharedPDF, getPDFbyId, getPDFurl, getSharedPDFurl} from '../controller/pdfcontroller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'), false);
  },
});

router.post('/upload', authMiddleware, upload.single('pdf'), uploadPDF);

router.get('/getpdfs', authMiddleware,getPDFs)
router.get('/share/:pdfId',authMiddleware,generateShareLink)
router.get('/shared/:token',viewSharedPDF)
router.get('/getpdf/:pdfId',authMiddleware,getPDFbyId)
router.get('/getpdfurl/:gcsfilename',authMiddleware,getPDFurl)
router.get('/getsharedpdfurl/:token/:gcsfilename',getSharedPDFurl)

export default router;
