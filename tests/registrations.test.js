const request = require('supertest');
const app = require('../server');

describe('Registrations API GET endpoints (requires auth)', () => {
  test('GET /registrations without auth returns 401', async () => {
    const res = await request(app).get('/registrations');
    expect(res.statusCode).toBe(401);
  });
});