import express from "express"
const router = express.Router();

import { getNotes, createNote, updateNote, likeNote, deleteNote, getNotesByQuery, getNoteById, addComment } from '../controllers/Note.controller.js'
import authMiddleware from '../middlewares/auth.js'

router.post('/:id/comment',authMiddleware, addComment);
router.get('/search', getNotesByQuery);
router.get('/',authMiddleware, getNotes);
router.get('/:id', getNoteById);
router.post('/', authMiddleware, createNote);
router.put('/:id', authMiddleware, updateNote);
router.post('/like/:id', authMiddleware, likeNote)
router.delete('/:id', authMiddleware, deleteNote);

export default router;