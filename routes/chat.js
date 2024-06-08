const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
require("dotenv").config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


router.post('/ask', async (req, res) => {
    const suggestion = req.body.suggestion;
    const message = req.body.message;
    const song = req.body.song;
    const lyric = req.body.lyrics;
    const lyrycWithoutNewlines = lyric.replace(/\n/g, '.');

    if (!suggestion || !message || !song || !lyric) {
        return res.status(400).json({ message: 'Missing params in the request body' });
    }

    const contexto = 'El usuario espera que le ayudes a cambiar su letra pues es similar a una canción ya existente: ' + song + '\n'
    const letra = 'La letra que el usuario quiere cambiar es la siguiente: "' + lyrycWithoutNewlines + '"\n'
    const prompt = 'Entonces, anteriormente le diste una sugerencia y él quiere preguntarte más cosas acerca de ella. Aquí la sugerencia que le diste: ' + suggestion + '\n\n'
    const promp2 = 'Darás consejos según lo que te pregunte el usuario acerca de la sugerencia. \n'
    const final = '\n\nFavor responde cosas únicamente referente a la letra y la sugerencia. No hables de más temas que no sean referentes a estos.'
    const final2 = 'Si te hablan en otro idioma diferente al español, favor hablar en el idioma que te hablen. Entonces, el usuario pregunta y/o dice: '


    try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: contexto + letra + prompt + promp2 + final + final2 + message}
          ]
        });
        res.status(200).json(response);
      } catch (err) {
        res.status(500).json("ERROR ", err.message);
    }
});

module.exports = router;