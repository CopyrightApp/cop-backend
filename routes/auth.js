const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
// @desc Auth with Google
// @route GET /auth/google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
    prompt: "select_account",
  })
);

// @desc Google auth callback
// @route GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    // Generar el token JWT
    const googleId = req.user.googleId;
    console.log(req.user);
    const payload = { googleId };

    const token = jwt.sign(payload, "secreto", { expiresIn: "1h" });
    // Configurar la cookie con el token
    res.cookie("jwtToken", token, { httpOnly: false, secure: false });
    res.redirect(`http://localhost:3000/checker?image=${req.user.image}`);
  }
);

// @desc     Standard signup
// @route    /auth/signup
router.post("/signup", async (req, res) => {
  //Para obtener los valores req.body.email, req.body.password
  const newUser = {
    authType: "DEFAULT",
    email: req.body.email,
    password: req.body.password,
  };
  try {
    let user = await User.findOne({ email: newUser.email });
    if (user) {
      return res.status(400).json({ message: "UserExists" });
    } else {
      user = await User.create(newUser);
      const email = newUser.email;

      const newHistory = {
        userId: email,
        values: [{ details: "El usuario ha comenzado" }],
      };
      history = await History.create(newHistory);

      const payload = { email };
      const token = jwt.sign(payload, "secreto", { expiresIn: "1h" });

      // Configurar la cookie con el token
      res.cookie("jwtToken", token, { httpOnly: false, secure: false });
      return res.status(201).json({ token });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// @desc    LogIn validation
// @route    /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const payload = { email };
    const token = jwt.sign(payload, "secreto", { expiresIn: "1h" });
    console.log("El token que hemos generado es ", token);

    res.cookie("jwtToken", token, { httpOnly: false, secure: false });
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
