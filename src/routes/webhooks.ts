import { Router } from 'express';

const router = Router();

router.get('/meta', (req, res) => {
  console.log(req.query);
  const challenge = req.query['hub.challenge'];
  res.type('text/plain').send(typeof challenge === 'string' ? challenge : '');
});

router.post('/meta', (req, res) => {
  console.log(req.query);
  res.json({
    received: {
      query: req.query,
      body: req.body,
    },
  });
});

export const webhookRouter = router;
