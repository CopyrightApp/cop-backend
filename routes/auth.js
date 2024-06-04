const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require('bcrypt')
// @desc Auth with Google
// @route GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc Google auth callback
// @route GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    // Generar el token JWT
    const payload = {
      user: req.user,
    };
    const token = jwt.sign(payload, "secreto", { expiresIn: "1h" });

    // Configurar la cookie con el token
    res.cookie("jwtToken", token, { httpOnly: false, secure: false });
    res.redirect("http://localhost:3000/checker");
  }
);

// @desc     Standard signup
// @route    /auth/signup
router.post("/signup", async (req, res) => {
  //Para obtener los valores req.body.email, req.body.password
  console.log("Ha entrado una solicitud ", req.body);
  const newUser = {
    authType: "DEFAULT",
    email: req.body.email,
    password: req.body.password,
  };
  try {
    let user = await User.findOne({ email: newUser.email });
    if (user) {
      console.log("Le respondemos que ya existe");
      return res.status(400).json({ message: "UserExists" });
    } else {
      console.log("Le respondemos con un JWT");
      user = await User.create(newUser);
      //Se ha creado un nuevo recurso.
      const token = jwt.sign(newUser, "secreto", { expiresIn: "1h" });

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
    
    const token = jwt.sign(req.body, "secreto", { expiresIn: "1h" });

    res.cookie("jwtToken", token, { httpOnly: false, secure: false });
    return res.status(200).json({ token }); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
