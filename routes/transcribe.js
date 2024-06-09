const express = require("express");
const path = require('path');
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Configuración básica de multer
const { Storage } = require("@google-cloud/storage");
const speech = require("@google-cloud/speech");
const fs = require("fs");

const storage = new Storage({
  keyFilename: "poetic-freedom-424502-m6-3500dddede76.json",
});

const bucketName = "copyright-bucket";

const speechClient = new speech.SpeechClient({
  keyFilename: "poetic-freedom-424502-m6-3500dddede76.json",
});

router.post("/audio", upload.single("audio"), async (req, res) => {
  // Verificar si el archivo ha sido recibido
  if (!req.file) {
    return res.status(400).json({ error: "No se recibió ningún archivo" });
  }

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
    languageCode: "en-US",
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

  // Información del archivo recibido
  console.log("Archivo recibido:", req.file);

  res.json({ transcription });
});

module.exports = router;
