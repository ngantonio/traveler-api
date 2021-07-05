import jwt, { decode } from 'jsonwebtoken'

export default function (req, res, next) {
  try {
    // get jwt to header
    const token = req.headers.authorization.split(" ")[1];
    if(!token) return res.status(401).json({"ok": false, "msg": "Unauthorized"})
    const isCustomAuth = token.length < 500;

    let decodeData;
     // validate token
    if (token && isCustomAuth) {
      decodeData = jwt.verify(token, process.env.SECRET_KEY);
      req.userLogged = decodeData?.user;
    } else {
      decodeData = jwt.decode(token);
      const userLogged = {
        id: decodeData?.sub,
        email: decodeData?.email
      }
      req.userLogged = userLogged;
    }
    next();
    
  } catch (error) {
    console.log(error);
    res.status(401).json({"ok": false, "msg": "Invalid Token, probably expired"})
  }

}