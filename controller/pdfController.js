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

    const gcsFileName = `${Date.now()}-${file.originalname}`;
    const blob = bucket.file(gcsFileName);


const blobStream = blob.createWriteStream({
  metadata: {
    contentType: file.mimetype,
  },
});

blobStream.on('error', (err) => {
  console.error(err);
  return res.status(500).json({ message: 'Error while uploading to GCS', error: err.message });
});

blobStream.on('finish', async () => {

            const newPDF = new PDF({
              owner: req.user.id,
              fileName: file.originalname,
              gcsFileName: gcsFileName,
              createdAt: Date.now()

            });



      await newPDF.save();
      const pdfDetails = {
        pdfId: newPDF._id,
        name: newPDF.fileName,
        gcsFileName: newPDF.gcsFileName,
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

//-------------------------getting signed url of a pdf---------------------------------
//----this gets the signed url of a pdf from Google Cloud Storage, and sends it to the client
export const getPDFurl = async(req,res)=>{
  const gcsfileName = req.params.gcsfilename;
console.log("gcsfilename is",gcsfileName)
  const file = bucket.file(gcsfileName);
  try{
    const  [exists] = await file.exists();
    if(!exists){
      return res.status(404).json({message: "File not found"})
    }
    
    const signedUrl = await file.getSignedUrl({
      action: 'read',
      expires : Date.now() + 60 * 60 * 1000,
    });
    console.log("signed url is",signedUrl[0])
    return res.status(200).json({url: signedUrl[0]})


  }catch(error){
    console.log(error)
  }

}
//-------------------------getting signed url of a shared pdf---------------------------------
export const getSharedPDFurl = async(req,res)=>{
  const gcsfileName = req.params.gcsfilename;
  const token = req.params.token;
  const pdf = await PDF.findOne({shareToken: token})
        if(!pdf){
            return res.status(404).json({message:"File not found or token has expired"})
        }
  


  const file = bucket.file(gcsfileName);
  try{
    const  [exists] = await file.exists();
    if(!exists){
      return res.status(404).json({message: "File not found"})
    }
    
    const signedUrl = await file.getSignedUrl({
      action: 'read',
      expires : Date.now() + 60 * 60 * 1000,
    });

    return res.status(200).json({url: signedUrl[0]})


  }catch(error){
    console.log(error)
  }

}




//----------------------fetching the names,id's of pdfs from a users PDF Collection-------------------------
export const getPDFs = async(req,res)=>{

    try {
        const pdfs = await PDF.find(
            { owner: req.user.id },
            { 
              _id: 1, 
              fileName: 1,  
              gcsFileName: 1,
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
        const pdfData = { gcsFileName: pdf.gcsFileName, fileName: pdf.fileName, pdfId: pdf._id }
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

        res.status(200).json({ gcsFileName: pdf.gcsFileName, fileName: pdf.fileName, pdfId: pdf._id })
    }
    catch(error){
        res.status(500).json({message: "Cannot retrieve file", error : error.message})
    }
}



