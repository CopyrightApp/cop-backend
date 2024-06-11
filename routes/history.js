const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const History = require("../models/History");

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
    if (decoded.googleId) {
      req.googleId = decoded.googleId;
    } else if (decoded.email) {
      req.email = decoded.email;
    }

    next();
  });
}
//@desc Ruta para agregar un elemento al historial
//@route POST /history
router.post("/", verificarJWT, async (req, res) => {
  if (req.googleId) {
    const googleId = req.googleId;
    let history = await History.findOne({ userId: googleId });
    if (history) {
      const newValue = { details: req.body.details };
      history.values.push(newValue);
      await history.save();
      return res.status(200).json({ history: history.values });
    }
    return res.status(400).json({ message: "User history can not be found" });
  } else if (req.email) {
    const email = req.email;
    let history = await History.findOne({ userId: email });
    if (history) {
      const newValue = { details: req.body.details };
      history.values.push(newValue);
      await history.save();
      return res.status(200).json({ history: history.values });
    }
    return res.status(400).json({ message: "User history can not be found" });
  } else {
    return res.status(400).json({ message: "JWT can not be resolved" });
  }
});

//@desc Ruta para obtener todo el historial de un su
//@route GET /history
router.get("/", verificarJWT, async (req, res) => {
  // El googleId del usuario está disponible en req.googleId
  if (req.googleId) {
    const googleId = req.googleId;
    let history = await History.findOne({ userId: googleId });
    return res.status(200).json({ history: history.values });
  } else if (req.email) {
    const email = req.email;
    let history = await History.findOne({ userId: email });
    return res.status(200).json({ history: history.values });
  } else {
    return res.status(400).json({ message: "JWT can not be resolved" });
  }
});

module.exports = router;
