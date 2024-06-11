const express = require("express");
const path = require('path');
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { Storage } = require("@google-cloud/storage");
const speech = require("@google-cloud/speech");
const { Translate } = require("@google-cloud/translate").v2;
const fs = require("fs");
const ffmpeg = require('fluent-ffmpeg');

const storage = new Storage({
  keyFilename: "poetic-freedom-424502-m6-3500dddede76.json",
});

const bucketName = "copyright-bucket";

const speechClient = new speech.SpeechClient({
  keyFilename: "poetic-freedom-424502-m6-3500dddede76.json",
});

const translate = new Translate({
  keyFilename: "poetic-freedom-424502-m6-3500dddede76.json",
});

router.post("/audio", upload.single("audio"), async (req, res) => {
  // Verificar si el archivo ha sido recibido
  if (!req.file) {
    return res.status(400).json({ error: "No se recibió ningún archivo" });
  }

  const language = JSON.parse(req.body.language)

  // console.log("lenguaje back:",language)

  const filePath = req.file.path;
  const destination = `uploads/${req.file.filename}`;

  await storage.bucket(bucketName).upload(filePath, {
    destination,
  });

  const gcsUri = `gs://${bucketName}/${destination}`;

  const audio = {
    uri: gcsUri,
  };

  const config = {
    encoding: "MP3",
    sampleRateHertz: 16000,
    languageCode: language.codigo,
    model: language.model,
  };

  const [operation] = await speechClient.longRunningRecognize({
    audio,
    config,
  });
  const [response] = await operation.promise();

  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  console.log("Soy la transcripción: \n", transcription);

  // Detectar el idioma del texto transcrito
  const [detection] = await translate.detect(transcription);
  const detectedLanguage = detection.language;
  console.log("Idioma detectado: ", detectedLanguage);

  // Información del archivo recibido
  console.log("Archivo recibido:", req.file);

  res.json({ transcription });
});

module.exports = router;
