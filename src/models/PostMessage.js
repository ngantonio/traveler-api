import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
  title: { type: String, trim: true },
  message: { type: String, trim: true },
  creator: { type: String, trim: true },
  tags: { type: [String]},
  selectedFile: { type: String, trim: true },
  likeCount: { type: Number, default: 0},
  created_at: { type: Date, default: new Date()} ,
})

const PostMessage = mongoose.model('PostMessage', postSchema);
export default PostMessage;