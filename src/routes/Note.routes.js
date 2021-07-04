import express from "express"
const router = express.Router();

import { getNotes, createNote, updateNote, deleteNote } from '../controllers/Note.controller.js'
import authMiddleware from '../middlewares/auth.js'

router.get('/', getNotes);
router.post('/', authMiddleware, createNote);
router.put('/:id', authMiddleware, updateNote);
router.delete('/:id', authMiddleware, deleteNote);

export default router;