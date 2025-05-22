import bucket from '../config/gcs.js';
import PDF from '../model/pdfModel.js';
import { v4 as uuidv4 } from 'uuid';
import User from '../model/userModel.js'


//-------------------------uploading a pdf---------------------------------
//----this uploads a pdf to Google Cloud Storage, and adds the details of that pdf to database 
export const uploadPDF = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

   const gcsFileName = `pdfs/${Date.now()}-${file.originalname}`;
const blob = bucket.file(gcsFileName);

const token = uuidv4();

const blobStream = blob.createWriteStream({
  resumable: false,
  metadata: {
    contentType: file.mimetype,
    metadata: {
      firebaseStorageDownloadTokens: token,
    },
  },
});

blobStream.on('error', (err) => {
  console.error(err);
  return res.status(500).json({ message: 'GCS upload error', error: err.message });
});

blobStream.on('finish', async () => {
  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(gcsFileName)}?alt=media&token=${token}`;

            const newPDF = new PDF({
              owner: req.user.id,
              fileName: file.originalname,
              filePath: publicUrl,
              createdAt: Date.now()

            });



      await newPDF.save();
      const pdfDetails = {
        name: newPDF.fileName,
        url: newPDF.filePath,
        createdOn: newPDF.createdAt
      }

      await User.findByIdAndUpdate(
            req.user.id,
            { $push: { pdfs: pdfDetails  } } )

      res.status(201).json({ message: 'PDF uploaded', pdf: newPDF });
    });

    blobStream.end(file.buffer);
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};


//----------------------fetching the names,urls from a users PDF Collection-------------------------
export const getPDFs = async(req,res)=>{

    try {
        const pdfs = await PDF.find(
            { owner: req.user.id },
            { 
              _id: 1, 
              fileName: 1,  
              filePath: 1, 
              createdAt: 1,
            });
        return res.status(200).json(pdfs);
      } catch (error) {
        res.status(500).json({error:error.message});
      }


}

//---------------------fetching a pdf by id-------------------
export const getPDFbyId = async (req,res) =>{
    const { pdfId } = req.params;

    try {
        const pdf = await PDF.findById(pdfId);
        if (!pdf || String(pdf.owner) !== req.user.id)
            return res.status(403).json({ message: 'Unauthorized or file not found' });
        const pdfData = { filePath: pdf.filePath, fileName: pdf.fileName, pdfId: pdf._id }
        res.status(200).json(pdfData);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve PDF', error: error.message });
    }
}

//------------------sharing a pdf--------------------
export const generateShareLink = async (req, res) => {
  const { pdfId } = req.params;

  try {
    const pdf = await PDF.findById(pdfId);
    console.log(pdf)
    if (!pdf || String(pdf.owner) !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized or file not found' });

    if (!pdf.shareToken) {
      pdf.shareToken = uuidv4(); 
      await pdf.save();
    }

    const link = `${process.env.FRONTEND_URL}/shared/${pdf.shareToken}`;
    res.json({ link });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate link', error: err.message });
  }
};


//-----------------------viewing pdf through invite link (which has a token embedded)--------------------

export const viewSharedPDF = async(req,res)=>{
    try{

        const token = req.params.token
        console.log(token)
        const pdf = await PDF.findOne({shareToken: token})
        if(!pdf){
            return res.status(404).json({message:"File not found or token has expired"})
        }

        res.status(200).json({ filePath: pdf.filePath, fileName: pdf.fileName, pdfId: pdf._id })
    }
    catch(error){
        res.status(500).json({message: "Cannot retrieve file", error : error.message})
    }
}



