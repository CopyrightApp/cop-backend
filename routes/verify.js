﻿const express = require("express");
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
    const userMessageWithoutNewlines = '"' + userMessage.replace(/\n/g, '.') + '"';

    //console.log("aaa",userMessageWithoutNewlines)

    const prompt = 'Eres un gran conocedor de canciones. Sabes de las más populares del medio. Dime, esta letra a cuál canción pertenece: \n\n'
    const aclaracion = '\n\nSi conoces la canción responde así: Esta letra ya existe o es similar a *Aquí insertarías la canción*. '
    const aclaracion2 = '\n\nSi no conoces la canción y unicamente cuando no la conoces, responde: Esta letra parece ser original. y agrégale sugerencias tipo Sin embargo, ten en cuenta que yo no conozco todas las canciones y deberías indagar más para evitar el plagio. '
    const final = 'Además, si conoces la canción y solamente cuando la conoces, entonces dame dos opciones separadas distintivamente con un asterisco(*), es decir, cada opción tendrá un asterisco(*). Cada una de las opciones va a tener sugerencias que consideres podrían ayudar a mejorar la letra o hacer que sea distinta a la de la canción encontrada.'
    const final2 = 'Que las opciones sean detalladas y que no sean tan cortas.'
    const conclusion = '\n\nFavor responde únicamente como lo solicité con las opciones si conoces la canción o sin las opciones cuando no, no agregue nada más.'

    //console.log(prompt + userMessageWithoutNewlines + aclaracion + final + final2 + aclaracion2 + conclusion)

    try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: prompt + userMessageWithoutNewlines + aclaracion + final + final2 + aclaracion2 + conclusion}
          ]
        });
        res.status(200).json(response);
      } catch (err) {
        res.status(500).json("ERROR ", err.message);
    }
})

module.exports = router;