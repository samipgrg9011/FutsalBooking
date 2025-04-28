const Joi = require("joi");
const User = require("../model/User");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");




// const signUpSchema = Joi.object({
//   FirstName: Joi.string().alphanum().min(3).max(30).required(),
//   LastName: Joi.string().alphanum().min(3).max(30).required(),
//   password: Joi.string().alphanum().min(8).max(30).required(),
//   Email: Joi.string().email().required(),
//   // phoneNumber: Joi.string().pattern(/^[0-9]{9,10}$/).required(),
//   phoneNumber: Joi.string().required(),

//   address: Joi.string().min(5).max(100).optional(),
// });

// const signup = async (req, res, next) => {
//   try {
//     const { error } = signUpSchema.validate(req.body, {
//       abortEarly: false,
//       stripUnknown: true,
//     });
//     if (error) {
//       let errors = error.details.map((el) => {
//         return {
//           msg: el.message,
//           params: el.context.key,
//         };
//       });
//       return res.status(400).send({ errors });
//     }


//     let hashedPassword = await bcrypt.hash(req.body.password, 10);
//     console.log(hashedPassword);

//     let user = await User.create({ ...req.body, password: hashedPassword });
//     let userObj = user.toObject();
//     delete userObj.password;

//     console.log(userObj);
//     res.send(userObj);
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };
const signUpSchema = Joi.object({
  FirstName: Joi.string().alphanum().min(3).max(30).required(),
  LastName: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().alphanum().min(8).max(30).required(),
  Email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().min(5).max(100).optional(),
  role: Joi.string().valid("user", "owner").default("user"), // Accept only 'user' or 'owner'
});

const signup = async (req, res, next) => {
  try {
    const { error, value } = signUpSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      let errors = error.details.map((el) => ({
        msg: el.message,
        params: el.context.key,
      }));
      return res.status(400).send({ errors });
    }

    // Destructure role separately to sanitize
    let { role, ...userData } = value;

    // Fallback safety check
    if (!["user", "owner"].includes(role)) {
      role = "user";
    }

    let hashedPassword = await bcrypt.hash(userData.password, 10);

    let user = await User.create({
      ...userData,
      role,
      password: hashedPassword,
    });

    let userObj = user.toObject();
    delete userObj.password;

    console.log(userObj);
    res.send(userObj);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const loginSchema = Joi.object({
  Email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(8).max(30).required(),

});

const loggedInUsers = new Map(); 
const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      let errors = error.details.map((el) => {
        return {
          msg: el.message,
          params: el.context.key,
        };
      });
      return res.status(400).send({ errors });
    }
    let user = await User.findOne({ Email: req.body.Email }).select({
      "+password": 1,
    });
    if (!user) {
      return res.status(400).send({ msg: "User not found" });
    }
    console.log(user);

    let matched = await bcrypt.compare(req.body.password, user.password);
    if (matched) {
      user = user.toObject();
      delete user.password;
      var token = jwt.sign(user, "shhhhh");

        // Store user session, but exclude admins
      if (user.role !== "admin") {
        loggedInUsers.set(user._id.toString(), { id: user._id, Email: user.Email, role: user.role, loggedInAt: new Date() });
      }

      res.send({
        user,
        token,
      });
    } else {
      res.status(401).send({ msg: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const becomeOwner = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user found." });
    }

    const userId = req.user._id;
    const { ownerName, location, contactInfo } = req.body;

    // Update the User document with owner-specific fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role: "owner", // Set the user's role to owner
        ownerName,
        location,

        contactInfo,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Generate a new token with updated user role
    const token = jwt.sign(
      {
        _id: updatedUser._id,
        FirstName: updatedUser.FirstName,
        LastName: updatedUser.LastName,
        Email: updatedUser.Email,
        role: updatedUser.role,
      },
      "shhhhh"
    );

    return res.status(200).json({
      success: true,
      message: "User role updated to Owner.",
      updatedUser,
      token,
    });

  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}



module.exports = {
  signup,
  login,
  becomeOwner,
  // loggedInUsers
};
