const request = require('supertest');
const path = require('path');
const app = require('./app');

describe('POST /transcribe/audio', () => {
    it('should return an error if not receives a file', async () => {
        const response = await request(app).post('/transcribe/audio');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'No se recibió ningún archivo' });
    });
});

describe('Express App', () => {
    it('should return a 404 if the route does not exist', async () => {
        const response = await request(app).get('/nonexistent-route');

        expect(response.status).toBe(404);
    });
});

describe('POST /audio', () => {
    it('should receive an audio file and return the transcription', async () => {
        const testAudioPath = path.join(__dirname, 'audioTest.mp3');
        const response = await request(app)
          .post('/transcribe/audio')
          .attach('audio', testAudioPath)
          .field('language', JSON.stringify({ codigo: 'es-US', model: 'latest_long' }));
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('transcription');
        console.log(response.body.transcription);
      }, 60000);
});

// afterAll(async () => {
//     // Limpia los archivos temporales si es necesario
//     await fs.emptyDir(path.join(__dirname, 'uploads'));
// });
