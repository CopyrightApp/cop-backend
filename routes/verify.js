const express = require("express");
const { Translate } = require('@google-cloud/translate').v2;
const path = require('path');
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const axios = require('axios');
const OpenAI = require("openai");
require("dotenv").config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const languageMap = {
  'English': 'en',
  'Español': 'es',
  'French': 'fr',
  'German': 'de',
  'Chinese': 'zh',
  'Italian': 'it',
  'Portuguese': 'pt',
  'Japanese': 'ja'
};

// const translate = new Translate({
//   keyFilename: "poetic-freedom-424502-m6-3500dddede76.json"
// });

router.post('/check', async (req, res) => {
    const userMessage = req.body.transcription;
    const userMessageWithoutNewlines = '"' + userMessage.replace(/\n/g, '.') + '"';

    const language = req.body.language;
    const targetLanguage = languageMap[language] || 'es';

    //console.log("aaa",userMessageWithoutNewlines)

    const prompt = 'Eres un gran conocedor de canciones. Sabes de las más populares del medio. Dime, esta letra a cuál canción pertenece: \n\n'
    const aclaracion = '\n\nSi conoces la canción responde así: Esta letra ya existe o es similar a *Aquí insertarías la canción*. '
    const aclaracion2 = '\n\nSi no conoces la canción y unicamente cuando no la conoces, responde: Esta letra parece ser original. y agrégale sugerencias tipo Sin embargo, ten en cuenta que yo no conozco todas las canciones y deberías indagar más para evitar el plagio. '
    const final = 'Además, si conoces la canción y solamente cuando la conoces, entonces dame dos opciones separadas distintivamente con un asterisco(*), es decir, cada opción tendrá un asterisco(*). Cada una de las opciones va a tener sugerencias que consideres podrían ayudar a mejorar la letra o hacer que sea distinta a la de la canción encontrada.'
    const final2 = 'Que las opciones sean detalladas y que no sean tan cortas.'
    const conclusion = '\n\nFavor responde únicamente como lo solicité con las opciones si conoces la canción o sin las opciones cuando no, no agregue nada más.'

    //console.log(prompt + userMessageWithoutNewlines + aclaracion + final + final2 + aclaracion2 + conclusion)

    //const translateText = await translate.translate("holaa", targetLanguage);
    //console.log("ha",translateText);
    try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: prompt + userMessageWithoutNewlines + aclaracion + final + final2 + aclaracion2 + conclusion}
          ]
        });
        const data = response.choices[0].message.content;
        res.status(200).json(data);
      } catch (err) {
        res.status(500).json(err.message);
    }
})

module.exports = router;
