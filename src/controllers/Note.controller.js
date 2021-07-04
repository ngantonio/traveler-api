import mongoose  from 'mongoose';
import TravelNote from '../models/TravelNote.model.js'

export const getNotes = async (req, res) => {
  try {
    const travelNotes = await TravelNote.find();
    return res.status(200).json({ok: true, notes: travelNotes});
     
   } catch (error) {
      return res.status(404).json({ok: true, msg:'notes not found', error: error.message });
   }
};

export const createNote = async (req, res) => {

   const { title, message, creator, selectedFile, tags } = req.body;

   if (!title || !message || !creator || !selectedFile ) return res.status(400).json({ "ok": false, 'msg': 'required fields are missing' })
   if (title === '' || message === '' || creator === '' || selectedFile === '') return res.status(400).json({ "ok": false, 'msg': 'empty fields were sent' })
   
  try {
    const newNote = new TravelNote(req.body);
    await newNote.save();
    return res.status(201).json({ok: true, note: newNote});
     
   } catch (error) {
       return res.status(409).json({ok: false, msg:'error to create note', error: error.message });
   }
};

export const updateNote = async (req, res) => {

   const { id } = req.params;
   const { title, message, creator, selectedFile, likeCount, tags } = req.body;
    
   if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ ok: false, msg: 'Id not valid' });

   if (!title || !message || !creator || !selectedFile ) return res.status(400).json({ "ok": false, 'msg': 'required fields are missing' })
   if (title === '' || message === '' || creator === '' || selectedFile === '') return res.status(400).json({ "ok": false, 'msg': 'empty fields were sent' })
   
   let recievedNote = { creator, title, message, likeCount, tags, selectedFile};
   try {
      // check if the note exists
      let note = await ProjectModel.findById(id)
      if(!note) return res.status(404).json({"ok": false, "msg": "note not found"})

      // update Note
      updatedNote = await TravelNote.findByIdAndUpdate({_id: id}, recievedNote, { new: true });
      return res.status(201).json({ok: true, note: updatedNote});
     
   } catch (error) {
      return res.status(409).json({ ok: false, msg: 'error to update note', error: error.message });
   }
};

export const deleteNote = async (req, res) => {
   const { id } = req.params;

   if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ok: false, msg:'Id not valid' });

   try {
      // check if the note exists
      let note = await ProjectModel.findById(id)
      if (!note) return res.status(404).json({ "ok": false, "msg": "note not found" })
      
      await TravelNote.findByIdAndRemove(id);
      return res.status(201).json({ ok: true, msg: "note has been deleted successfully" });
     
   } catch (error) {
      return res.status(409).json({ ok: false, msg: 'error to delete note', error: error.message });
   }
};
