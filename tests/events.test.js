const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

// Increase timeout for all tests in this file
jest.setTimeout(15000);

beforeAll(async () => {
  // Wait for Mongoose connection (app already connects, but just in case)
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

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