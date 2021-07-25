import UserModel from '../models/User.model.js'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'


const generateAuthToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" })
};



export const login = async (req, res) => {

  const { email, password } = req.body;
  
  if (!email || email === '' || !password || password === '')
    return res.status(400).json({ "ok": false, 'msg': 'required fields are missing' })
  
  try {
    // validate if user exist
    let userExist = await UserModel.findOne({ email })
    if (!userExist) return res.status(400).json({"ok": false, "msg":`User does not exist`})
    
    // check password 
    const correctPassword = await bcryptjs.compare(password, userExist.password)
    if(!correctPassword) return res.status(400).json({"ok": false, "msg":`invalid Credentials`})

    // create and sign JWT
    const payload = {
      user: {
        id: userExist._id,
        email: userExist.email
      }
    };

    const token = generateAuthToken(payload)
     let userSend = {
        "_id": userExist._id,
        "name": userExist.firstName,
        "lastName": userExist.lastName,
        "email": userExist.email,
        "created_at": userExist.created_at
     }
    return res.status(200).json({"ok": true, "result": userSend, token})

  } catch (error) {
    return res.status(400).json({"ok": false, error})
  }
}


export const register = async (req, res) => {

  const { firstName, lastName, email, password } = req.body;

  if (!email || email === '' || !password || password === '' || !firstName || firstName === '')
    return res.status(400).json({ "ok": false, 'msg': 'required fields are missing' })
  
  try {
    // validate if user not exist
    let userExist = await UserModel.findOne({ email })
    if (userExist) return res.status(400).json({ "ok": false, "msg": `user already exists with this email` })
    
    // create user 
    let newUser = new UserModel(req.body);

    // hash password
    newUser.password = await bcryptjs.hash(password, 10);
  
    // save user
    await newUser.save();
    
    // create and sign JWT
    const payload = {
      user: {
        id: newUser._id,
        email: newUser.email
      }
    };
    const token = generateAuthToken(payload)

    let userSend = {
        "_id": newUser._id,
        "name": newUser.firstName,
        "lastName": newUser.lastName,
        "email": newUser.email,
        "created_at": newUser.created_at
      }
    return res.status(200).json({"ok": true, "result": userSend, token})
    
  } catch (error) {
    console.log(error);
    res.status(400).json({"ok": false, error})
  }
}