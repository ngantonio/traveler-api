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

   const { title, message, creatorName, selectedFile, tags } = req.body;

   if (!title || !message || !creatorName || !selectedFile ) return res.status(400).json({ "ok": false, 'msg': 'required fields are missing' })
   if (title === '' || message === '' || creatorName === '' || selectedFile === '') return res.status(400).json({ "ok": false, 'msg': 'empty fields were sent' })
   
   
   try {
      const newNote = new TravelNote(req.body);
      newNote.creatorId = req.userLogged.id;
      await newNote.save();
      return res.status(201).json({ok: true, note: newNote});
     
   } catch (error) {
       return res.status(409).json({ok: false, msg:'error to create note', error: error.message });
   }
};

export const updateNote = async (req, res) => {

   const { id } = req.params;
   const { title, message, creatorName, selectedFile, tags } = req.body;
   
   if (!title || !message || !creatorName || !selectedFile ) return res.status(400).json({ "ok": false, 'msg': 'required fields are missing' })
   if (title === '' || message === '' || creatorName === '' || selectedFile === '') return res.status(400).json({ "ok": false, 'msg': 'empty fields were sent' })
   
   const newNote = { creatorName, title, message, tags, selectedFile, _id: id };
   try {
      // check if the note exists
      let note = await TravelNote.findById(id)
      if (!note) return res.status(404).json({ "ok": false, "msg": "note not found" })
      
      // check that the creator of the note is the same person who is authenticated
      if(req.userLogged.id !== note.creatorId.toString()) return res.status(401).json({"ok": false, "msg": "Unathorized operation"})

      // update Note
      await TravelNote.findByIdAndUpdate(id, newNote, { new: true });
      return res.status(201).json({ok: true, note: newNote});
     
   } catch (error) {
      console.log("entra al error");
      console.log(error);
      return res.status(409).json({ ok: false, msg: 'error to update note', error: error.message });
   }
};

export const likeNote = async (req, res) => {

   const { id } = req.params;
   if (!req.userLogged.id) return res.status(404).json({ ok: false, msg: "Unauthorized" });
   
   try {
      // check if the note exists
      let note = await TravelNote.findById(id)
      if (!note) return res.status(404).json({ "ok": false, "msg": "note not found" })

      /**
       * find the userId into likes array, if not exists, can be like the note
       * else, dislike the note
       *  */ 
      const index = note.likes.findIndex((id) => id === String(req.userLogged.id));
      if (index === -1) {
         // like the note
         note.likes.push(req.userLogged.id)
      } else {
         // dislike a note
         note.likes = note.likes.filter((id) => id !== String(req.userLogged.id))
      }

      // update the note finally
      const updatedNote = await TravelNote.findByIdAndUpdate(id, note, { new: true });
      return res.status(201).json({ok: true, msg: "liked", note: updatedNote });
     
   } catch (error) {
      console.log("entra al error");
      console.log(error);
      return res.status(409).json({ ok: false, msg: 'error to update note', error: error.message });
   }
};


export const deleteNote = async (req, res) => {
   const { id } = req.params;

   if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ ok: false, msg: 'Id not valid' });
   try {
      // check if the note exists
      let note = await TravelNote.findById(id)
      if (!note) return res.status(404).json({ "ok": false, "msg": "note not found" })

      // check that the creator of the note is the same person who is authenticated
      if(req.userLogged.id !== note.creatorId.toString()) return res.status(401).json({"ok": false, "msg": "Unathorized operation"})
      
      await TravelNote.findByIdAndRemove(id);
      return res.status(201).json({ ok: true, msg: "note has been deleted successfully" });
     
   } catch (error) {
      return res.status(409).json({ ok: false, msg: 'error to delete note', error: error.message });
   }
};
