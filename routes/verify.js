const express = require("express");
const path = require('path');
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Configuración básica de multer
const axios = require('axios');
const OpenAI = require("openai");
require("dotenv").config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post('/check', async (req, res) => {
    const userMessage = req.body.transcription;
    console.log("XD", userMessage)

    const prompt = ' Eres un gran conocedor de canciones. Sabes de las más populares del medio. Dime, esta letra a cuál canción pertenece: \n'
    //const inicio = 'Yo escribí esta letra, si ya pertenece a una canción existente o es similar a alguna. Ayúdame a cambiarla para que ya no incumpla las normas: \n'

    try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: prompt + userMessage }
          ]
        });
        res.status(200).json(response);
      } catch (err) {
        res.status(500).json("ERROR ", err.message);
    }
})

module.exports = router;