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

    const prompt = '\n\nEres un gran conocedor de canciones. Sabes de las más populares del medio. Dime, esta letra a cuál canción pertenece \n'
    const inicio = 'Yo escribí esta letra: \n'
    const aclaracion = 'Si conoces la canción responde así: Esta letra ya existe o es similar a *inserte la canción a la cual pertenece.'
    const aclaracion2 = '\nSi no conoces la canción y solamente cuando no conoces la canción, responde: Esta letra parece ser original. y agrégale sugerencias tipo Sin embargo, ten en cuenta que yo no conozco todas las canciones y deberías indagar más para evitar el plagio.'
    const final = '\nAdemás, si la conoces y solamente cuando conoces la canción. Dame dos opciones separadas distintivamente con un asterisco(*). Cada una de las opciones va a tener sugerencias que consideres podrían ayudar a mejorar la letra o hacer que sea distinta a la de la canción encontrada.'
    const final2 = '\nQue las opciones sean detalladas y que no sean tan cortas.'
    const conclusion = '\n\nFavor responde únicamente como lo solicité, no agregue nada más.'

    try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: inicio + userMessage + prompt + aclaracion + final + aclaracion2 + final2 + conclusion}
          ]
        });
        res.status(200).json(response);
      } catch (err) {
        res.status(500).json("ERROR ", err.message);
    }
})

module.exports = router;