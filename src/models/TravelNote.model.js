import mongoose from 'mongoose';

const travelNoteSchema = mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  creator: { type: String, trim: true },
  tags: { type: [String]},
  selectedFile: { type: String, required: true, trim: true },
  likeCount: { type: Number, default: 0},
  created_at: { type: Date, default: new Date()}
})

const TravelNote = mongoose.model('TravelNote', travelNoteSchema);
export default TravelNote;