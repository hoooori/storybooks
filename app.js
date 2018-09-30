const express  = require('express');
const mongooge = require('mongoose');
const app      = express();
const port     = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
