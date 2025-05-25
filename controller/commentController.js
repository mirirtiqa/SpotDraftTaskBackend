import Comment from "../model/commentModel.js"
import PDF from "../model/pdfModel.js"

export const addComment = async (req, res) => {
  const { authorName, content,pdfId} = req.body;

  try {
    const comment = new Comment({ pdfId, authorName, content});
    await comment.save();
    res.status(201).json({ comment });
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};

export const addCommentOnShare = async (req, res) => {
  const { authorName, content,pdfId, sharedToken} = req.body;
  const pdf = await PDF.findOne({shareToken: sharedToken})
          if(!pdf){
              return res.status(404).json({message:"File not found or token has expired"})
          }


  try {
    const comment = new Comment({ pdfId, authorName, content});
    await comment.save();
    res.status(201).json({ comment });
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};

export const getComments = async (req, res) => {
  const { pdfId } = req.params;
  if (!pdfId) {
    return res.status(400).json({ message: 'PDF ID is required' });
  }

  if(req.params.token){
    const { token } = req.params;
    const pdf = await PDF.findOne({shareToken: token})
            if(!pdf){
                return res.status(404).json({message:"Associated file not found or token has expired"})
            }

    try {
      const comments = await Comment.find({ pdfId: req.params.pdfId });
      return res.json({ comments });
    } catch (err) {
      return res.status(500).json({ message: 'Error fetching comments', error: err.message });
    }
  }


  try {
    const comments = await Comment.find({ pdfId: req.params.pdfId }).sort({ createdAt: 1 });
    return res.json({ comments });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
};
