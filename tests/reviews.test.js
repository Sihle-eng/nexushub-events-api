const request = require('supertest');
const app = require('../server');

describe('Reviews API GET endpoints', () => {
  test('GET /reviews/event/:eventId with valid eventId returns 200', async () => {
    // Use a dummy ID; will return empty array or 200
    const res = await request(app).get('/reviews/event/5f9f1b9b9b9b9b9b9b9b9b9b');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});