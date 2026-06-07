const request = require('supertest');
const path = require('path');
const fs = require('fs');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key';
process.env.JWT_EXPIRES_IN = '1h';
process.env.DB_PATH = path.join(__dirname, '../../padelzgz_test.db');

const { initDb, getDb } = require('../src/db/database');
const app = require('../src/index');

beforeAll(async () => {
  await initDb();
});

afterAll(() => {
  try {
    const db = getDb();
    if (db) db.close();
  } catch (_) {}
  const dbPath = path.join(__dirname, '../../padelzgz_test.db');
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
});

describe('POST /api/auth/register', () => {
  test('registra un nuevo usuario correctamente', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User', email: 'testuser@test.com', password: 'password123',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('testuser@test.com');
    expect(res.body.user.role).toBe('user');
    expect(res.body.user).not.toHaveProperty('password');
  });

  test('rechaza registro con email duplicado', async () => {
    await request(app).post('/api/auth/register').send({ name: 'Dup', email: 'dup@test.com', password: 'password123' });
    const res = await request(app).post('/api/auth/register').send({ name: 'Dup2', email: 'dup@test.com', password: 'password123' });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  test('rechaza registro sin campos obligatorios', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'solo@email.com' });
    expect(res.status).toBe(400);
  });

  test('rechaza contraseña menor de 6 caracteres', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'Short', email: 'short@test.com', password: '123' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  const credentials = { email: 'login_test@test.com', password: 'mypassword123' };

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({ name: 'Login Test', ...credentials });
  });

  test('hace login correctamente y devuelve token', async () => {
    const res = await request(app).post('/api/auth/login').send(credentials);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(credentials.email);
  });

  test('rechaza credenciales incorrectas', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: credentials.email, password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  test('rechaza login sin email', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: 'test123' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'Me User', email: 'me@test.com', password: 'password123' });
    token = res.body.token;
  });

  test('devuelve el usuario autenticado', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('me@test.com');
  });

  test('rechaza sin token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('rechaza con token inválido', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer token_falso');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/courts', () => {
  test('devuelve la lista de pistas públicamente', async () => {
    const res = await request(app).get('/api/courts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('price');
  });
});
