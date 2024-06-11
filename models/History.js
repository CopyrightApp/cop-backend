const mongoose = require("mongoose");

// Define el esquema para los objetos dentro del array `values`
const ValueSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, required: true, default: Date.now },
    details: { type: String, required: false },
  },
  { _id: false }
); 


// Define el esquema `History`
const HistorySchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Referencia a User
  values: { type: [ValueSchema], required: true }, // `values` es un array de `ValueSchema`
  fecha: { type: Date, required: true, default: Date.now },
});

// Crea y exporta el modelo `History`
module.exports = mongoose.model("History", HistorySchema);
