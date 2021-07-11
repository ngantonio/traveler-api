import mongoose from 'mongoose';

const travelNoteSchema = mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  creatorName: { type: String, trim: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  tags: { type: [String]},
  selectedFile: { type: String, required: true, trim: true },
  likes: { type: [String], default: [] },
  comments: { type: [String], default: [] },
  place: { type: String, trim: true },
  created_at: { type: Date, default: new Date()},
  updated_at: { type: Date, default: new Date()}
})

const TravelNote = mongoose.model('TravelNote', travelNoteSchema);
export default TravelNote;