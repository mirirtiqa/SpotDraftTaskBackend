import Comment from "../model/commentModel.js"

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

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ pdfId: req.params.pdfId }).sort({ createdAt: 1 });
    res.json({ comments });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
};
