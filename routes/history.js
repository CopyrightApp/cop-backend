const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/History");

// Middleware para verificar el JWT en las solicitudes
function verificarJWT(req, res, next) {
  const token = req.headers.authorization;
  // Verificar si el token está presente
  if (!token) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  // Verificar y decodificar el token
  jwt.verify(token, "secreto", (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensaje: "Token inválido" });
    }
    console.log("Lo decodificado es ", decoded);
    if (decoded.googleId) {
      req.googleId = decoded.googleId;
    } else if (decoded.email) {
      req.email = decoded.email;
    }

    next();
  });
}

// Ruta protegida que requiere el JWT para acceder
router.get("/", verificarJWT, async(req, res) => {
  // El googleId del usuario está disponible en req.googleId
  if (req.googleId) {
    const googleId = req.googleId;
    let history = await History.findOne(googleId)
    return res.status(200).json({ googleId: googleId });
  } else if (req.email) {
    const email = req.email;
    return res.status(200).json({ email: email });
  } else {
    return res.status(400).json({ message: "JWT can not be resolved" });
  }
});

module.exports = router;
