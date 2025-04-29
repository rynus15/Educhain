const router = require('express').Router();
const { Activity } = require('../db');

router.post('/', async (req, res) => {
  const { userId, action } = req.body;
  await Activity.create({ userId, action });
  res.json({ message: 'Audit logged' });
});

module.exports = router;
