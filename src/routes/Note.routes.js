import express from "express"
const router = express.Router();

import { getNotes, createNote, updateNote, likeNote, deleteNote, getNotesByQuery } from '../controllers/Note.controller.js'
import authMiddleware from '../middlewares/auth.js'

router.get('/search', getNotesByQuery);
router.get('/', getNotes);
router.post('/', authMiddleware, createNote);
router.put('/:id', authMiddleware, updateNote);
router.post('/like/:id', authMiddleware, likeNote)
router.delete('/:id', authMiddleware, deleteNote);

export default router;