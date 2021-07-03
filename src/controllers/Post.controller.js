import mongoose  from 'mongoose';
import PostMessage from '../models/PostMessage.js'

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();
    return res.status(200).json({ok: true, posts: postMessages});
     
   } catch (error) {
      return res.status(404).json({ok: true, msg:'Posts not found' });
   }
};

export const createPost = async (req, res) => {

  const post = req.body;

  try {
    const newPost = new PostMessage(post);
    await newPost.save();
    return res.status(201).json({ok: true, post: newPost});
     
   } catch (error) {
       return res.status(409).json({ok: true, msg:'error to create post' });
   }
};

export const updatePost = async (req, res) => {

   const { id } = req.params;
   const { title, message, creator, selectedFile, tags } = req.body;
    
   if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ok: false, msg:'Mo post wuth that id' });

   let updatedPost = { creator, title, message, tags, selectedFile};
   try {

   updatedPost = await PostMessage.findByIdAndUpdate({_id: id}, updatedPost, { new: true });
   return res.status(201).json({ok: true, post: updatedPost});
     
  } catch (error) {
     console.log(error);
      return res.status(409).json({ok: false, msg:'error to update post' });
   }
};



export const deletePost = async (req, res) => {

   const { id } = req.params;

   if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ok: false, msg:'Mo post wuth that id' });


   try {
   await PostMessage.findByIdAndRemove(id);
   return res.status(201).json({ok: true, msg:"Post has been deleted successfully"});
     
  } catch (error) {
     console.log(error);
      return res.status(409).json({ok: false, msg:'error to delete post' });
   }
};
