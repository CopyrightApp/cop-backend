const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configuración básica de multer
const app = express()
const { Storage } = require('@google-cloud/storage');
const speech = require('@google-cloud/speech')
const fs = require('fs')

process.env.GOOGLE_APPLICATION_CREDENTIALS = 'poetic-freedom-424502-m6-3500dddede76.json'

app.use(cors()); 
app.use(express.json());
const port = process.env.PORT || 4000;

app.get("/", (req,res) => {res.send("Server is running")})

const storage = new Storage({
  keyFilename: 'poetic-freedom-424502-m6-3500dddede76.json' 
});

const bucketName = 'copyright-bucket' 

const speechClient = new speech.SpeechClient({
  keyFilename: 'poetic-freedom-424502-m6-3500dddede76.json'
})


app.post('/transcribe', upload.single('audio'), async (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const destination = `uploads/${req.file.filename}`;
  await storage.bucket(bucketName).upload(filePath, {
    destination,
  });

  const gcsUri = `gs://${bucketName}/${destination}`;

  const audio = {
    uri: gcsUri
  }

  const config = {
    encoding: 'MP3',
    sampleRateHertz: 44100,
    languageCode: 'es-US'
  }

  const [operation] = await speechClient.longRunningRecognize({ audio, config });
  const [response] = await operation.promise();


  const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
  console.log("Soy la transcripción: \n", response)
  // Verificar si el archivo ha sido recibido
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió ningún archivo' });
  }

  // Información del archivo recibido
  console.log('Archivo recibido:', req.file);

  res.json({transcription})

})

let server;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, () => {
    console.log('Server in running on port', port);
  });
}

module.exports = server ? server : app;