import express from "express"
const router = express.Router();

import { getNotes, createNote, updateNote, deleteNote } from '../controllers/Note.controller.js'

router.get('/', getNotes);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;