// controllers/userController.js
const User = require("../model/User");
const path = require("path");
const bcrypt = require("bcrypt");


const getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password"); // Exclude password
      if (!user) {
        return res.status(404).send({ msg: "User not found" });
      }
      
      res.status(200).send({ user });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Internal Server Error", error: error.message });
    }
  };
// Controller to upload the user profile image
const uploadUserProfileImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).send({ msg: "Image is required" });
    }

    const image = req.files.image;
    const imagePath = path.join(path.resolve(), "uploads", image.name);
    await image.mv(imagePath);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }
    user.profileImage = image.name;
    await user.save({ validateBeforeSave: false }); 

    res.status(200).send({ msg: "Profile image uploaded", profileImage: image.name });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Internal Server Error", error: error.message });
  }
};

// Controller to update user profile details
const updateUserProfile = async (req, res) => {
    const { FirstName, LastName, phoneNumber, address, password, Email } = req.body;
  
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).send({ msg: "User not found" });
      }
  
      // Update password if provided
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
  
      // Update other fields
      user.FirstName = FirstName || user.FirstName;
      user.LastName = LastName || user.LastName;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.address = address || user.address;
      user.Email = Email || user.Email; 
  
      await user.save();
  
      res.status(200).send({ msg: "User profile updated", user });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Internal Server Error", error: error.message });
    }
  };
  


module.exports = {
  uploadUserProfileImage,
  updateUserProfile,
  getUserProfile
};
