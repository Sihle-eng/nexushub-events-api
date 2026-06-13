const request = require('supertest');
const app = require('../server');

describe('Events API GET endpoints', () => {
  test('GET /events should return 200 and an array', async () => {
    const res = await request(app).get('/events');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /events/:id with invalid id returns 404', async () => {
    const res = await request(app).get('/events/invalid-id');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});