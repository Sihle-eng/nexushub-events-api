const request = require('supertest');
const app = require('../server');

describe('Categories API GET endpoints', () => {
  test('GET /categories should return 200 and an array', async () => {
    const res = await request(app).get('/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /categories/:id with invalid id returns 404', async () => {
    const res = await request(app).get('/categories/invalid-id');
    expect(res.statusCode).toBe(404);
  });
});