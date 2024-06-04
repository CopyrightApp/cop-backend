const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: false },
  displayName: { type: String, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  authType: { type: String, required: true },
  email: { type: String, required: false },
  password: { type: String, required: false },
  image: { type: String, required: false },
  createdAt: { type: Date, required: false, default: Date.now },
});

// Middleware para encriptar la contraseña antes de guardar el usuario
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password") || user.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("User", UserSchema);
