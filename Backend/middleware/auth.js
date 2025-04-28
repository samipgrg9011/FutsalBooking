var jwt = require("jsonwebtoken");
const { OWNER, USER, ADMIN } = require("../Constants/User");

const checkAuthorization = (req, res, next) => {
    let token = req.headers.authorization?.replace("Bearer ", "");
    let isloggedIn = false;
  
    try {
      var decoded = jwt.verify(token, "shhhhh");  
      req.user = decoded;
      console.log(req.user);

      console.log("User decoded:", req.user); 
  
      isloggedIn = true;
    } catch {}
  
    if (isloggedIn) {
      next();
    } else {
      res.status(401).send({
        msg: "Unauthorized",
      });
    }
  };
  

  
const isOwner= (req, res, next) => {

  if (req.user.role === OWNER) {
    next();
  } else {
    res.status(403).send({
      msg: "Access denied, only for owner",
    });
  }
};

const isUser = (req, res, next) => {

  if (req.user.role === USER) {
    next();
  } else {
    res.status(403).send({
      msg: "Access denied, only for user",
    });
  }
};

const isAdmin = (req, res, next) => {

  if (req.user.role === ADMIN) {
    next();
    // console.log(req.user.role);
    
  } else {
    res.status(403).send({
      msg: "Access denied",
    });
  }
};
  
module.exports = {
  checkAuthorization,
  isOwner,
  isUser,
  isAdmin
};
