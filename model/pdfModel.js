import mongoose from "mongoose"
const PDFSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  fileName: String,
  gcsFileName: String,
  sharedWith: [String],
  createdAt: { type: Date, default: Date.now },
  shareToken: { type: String, unique: true }
});

export default mongoose.model("PDF",PDFSchema);

