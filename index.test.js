const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('./index');
const { Storage } = require('@google-cloud/storage');
const speech = require('@google-cloud/speech');

describe('POST /transcribe', () => {

  it('debería devolver un error si no se recibe un archivo', async () => {
    const response = await request(app).post('/transcribe');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No se recibió ningún archivo');
  });
});


describe('Express Application', () => {
    it('debería responder a GET / con el mensaje esperado', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Server is running');
    });
  });