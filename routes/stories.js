const express  = require('express');
const router   = express.Router();

// index
router.get('/', (req, res) => {
  res.render('stories/index')
});

// new
router.get('/add', (req, res) => {
  res.render('stories/add');
});

module.exports = router;