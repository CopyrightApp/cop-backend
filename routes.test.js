const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('./app');
const { Storage } = require('@google-cloud/storage');
const speech = require('@google-cloud/speech');
const exp = require('constants');

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


