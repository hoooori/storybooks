const express = require('express');
const router  = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

// index
router.get('/', (req, res) => {
  res.render('stories/index')
});

// new
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

module.exports = router;