import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import buildApp from '../src/app.js';

process.env.CORS_ORIGIN = 'http://localhost:5173';

let server;
let base;

before(async () => {
  const app = buildApp(':memory:');
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  const { port } = server.address();
  base = `http://localhost:${port}/api/tasks`;
});

after(() => {
  server.close();
});

test('POST valid task returns 201', async () => {
  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Test task', priority: 'high' }),
  });
  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.data.title, 'Test task');
  assert.equal(body.data.status, 'pending');
});

test('POST empty title returns 400', async () => {
  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: '   ' }),
  });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.ok(body.error);
});

test('GET lists tasks', async () => {
  const res = await fetch(base);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.data));
  assert.ok(body.data.length >= 1);
});

test('PATCH toggle flips status', async () => {
  const post = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Toggle me' }),
  });
  const created = (await post.json()).data;
  assert.equal(created.status, 'pending');

  const toggle = await fetch(`${base}/${created.id}/toggle`, { method: 'PATCH' });
  assert.equal(toggle.status, 200);
  const toggled = (await toggle.json()).data;
  assert.equal(toggled.status, 'completed');
});

test('GET unknown id returns 404', async () => {
  const res = await fetch(`${base}/99999`);
  assert.equal(res.status, 404);
});

test('PUT unknown id returns 404', async () => {
  const res = await fetch(`${base}/99999`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'nope' }),
  });
  assert.equal(res.status, 404);
});

test('DELETE unknown id returns 404', async () => {
  const res = await fetch(`${base}/99999`, { method: 'DELETE' });
  assert.equal(res.status, 404);
});
