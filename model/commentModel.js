const CommentSchema = new mongoose.Schema({
  pdfId: { type: mongoose.Schema.Types.ObjectId, ref: 'PDF' },
  authorName: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});
