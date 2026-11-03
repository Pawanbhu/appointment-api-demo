const express = require('express');
const { createStore } = require('./slots');

function createApp(store = createStore()) {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.post('/appointments', (req, res) => {
    try {
      res.status(201).json(store.book(req.body || {}));
    } catch (err) {
      res.status(err.code === 'CONFLICT' ? 409 : 400).json({ error: err.message });
    }
  });

  app.get('/doctors/:doctorId/appointments', (req, res) => {
    res.json(store.list(req.params.doctorId, req.query.date));
  });

  app.delete('/appointments/:id', (req, res) => {
    const ok = store.cancel(Number(req.params.id));
    ok ? res.status(204).end() : res.status(404).json({ error: 'Not found' });
  });

  return app;
}

module.exports = { createApp };
