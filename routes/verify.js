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
    const userMessage = req.body.message;

    const prompt = 'Eres un profesional en detectar plagio en canciones, más precisamente en sus letras. Trabajas para una empresa que busca este tipo de piratería. Quiero saber si esta letra que escribí es plagio y a cuál canción pertenece y cuál sería o si se parece en alguna otra.'

    try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: userMessage + prompt }
          ]
        });
        res.status(200).json(response);
      } catch (err) {
        res.status(500).json("ERROR ", err.message);
    }
})

module.exports = router;