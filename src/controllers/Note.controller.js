import mongoose  from 'mongoose';
import TravelNote from '../models/TravelNote.model.js'

export const getNotes = async (req, res) => {
   const { page } = req.query;
   console.log("recibida");

   if (!page) page = 1;
   try {
      const LIMIT = 4;
      const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

      const totalDocuments = await TravelNote.countDocuments({});
      const travelNotes = await TravelNote.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
      return res.json({ ok: true, notes: travelNotes, currentPage: Number(page), numberOfPages: Math.ceil(totalDocuments / LIMIT) });
   } catch (error) {
      return res.status(404).json({ok: true, msg:'notes not found', error: error.message });
  }
};

export const getNoteById = async (req, res) => { 
   const { id } = req.params;
   try {
      // check if the note exists
      let note = await TravelNote.findById(id)
      if (!note) return res.status(404).json({ "ok": false, "msg": "note not found" })
      return res.json({ ok: true, note});
    } catch (error) {
      return res.status(404).json({ok: true, msg:'note not found', error: error.message });
    }
}


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
 

export const getNotesByQuery = async (req, res) => {

   const { query, tags } = req.query;
   console.log(req.query);
   try {
      // Reg exp para permitir las coincidencias por subString
      const title = new RegExp(query, "i");

      // Busqueda solo por tags
      if (query === "none" && tags !== '') {
         const notes = await TravelNote.find({ tags: { $in: tags.split(',') } });
         return res.status(201).json({ ok: true, data: notes });
      }
      // Busqueda solo por titulo
      if (tags === '') {
         const notes = await TravelNote.find({ title });
         return res.status(201).json({ ok: true, data: notes });
      }
      // si no entro en los casos anteriores, la busqueda es para titulo y tags
      const notes = await TravelNote.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});  
      return res.status(201).json({ ok: true, data: notes });
       
   } catch (error) {
      return res.status(404).json({ ok: false, msg: 'error to fetching notes', error: error.message });
    }
};


export const addComment = async (req, res) => {

   const { id } = req.params;
   const { value } = req.body;

   if (!value) return res.status(404).json({ "ok": false, "msg": "The comment object is required" })

   try {
      let note = await TravelNote.findById(id)
      if (!note) return res.status(404).json({ "ok": false, "msg": "note not found" })

      // add new comment
      note.comments.push(value);
      const updatedNote = await TravelNote.findByIdAndUpdate(id, note, { new: true })
      
      return res.status(201).json({ ok: true, note: updatedNote });

   } catch (error) {
      
   }

}