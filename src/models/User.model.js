import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: {type: String, trim: true },
  email: {type: String, required: true, trim: true, unique:true },
  password: {type: String, required: true, trim: true },
  created_at: {type: Date, trim: true, default: Date.now() }
})

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;