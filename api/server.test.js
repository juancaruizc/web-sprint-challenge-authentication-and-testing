const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

const Juan = { username: 'Juan', password: '1234' };
const Steve = { username: 'Steve' };

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db('users').truncate();
});

afterAll(async () => {
  await db.destroy();
});

describe('endpoints', () => {
  describe('[POST] /api/auth/register', () => {
    it('returns newly registered user', async () => {
      const res = await request(server).post('/api/auth/register').send(Juan);
      expect(res.body.username).toBe('Juan');
    });
    it('returns status code 401 when no password provided', async () => {
      const res = await request(server).post('/api/auth/register').send(Steve);
      expect(res.status).toBe(401);
    });
  });
  describe('[POST] /api/auth/login', () => {
    it('welcomes user on login', async () => {
      await request(server).post('/api/auth/register').send(Juan);
      const res = await request(server).post('/api/auth/login').send(Juan);
      expect(res.body.message).toMatch(/welcome/);
    });
    it('returns status code 401 if invalid credentials', async () => {
      const res = await request(server).post('/api/auth/register').send(Steve);
      expect(res.status).toBe(401);
    });
  });
  describe('[GET] /api/jokes', () => {
    it('responds with status code 200 when logged in', async () => {
      await request(server).post('/api/auth/register').send(Juan);
      const login = await request(server).post('/api/auth/login').send(Juan);
      const token = login.body.token;
      const res = await request(server)
        .get('/api/jokes')
        .set({ Authorization: token });
      expect(res.status).toBe(200);
    });
    it('responds with status code 401 when not logged in', async () => {
      const res = await request(server).get('/api/jokes');
      expect(res.status).toBe(401);
    });
  });
});
