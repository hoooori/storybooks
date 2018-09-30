const express  = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const auth     = require('./routes/auth');
const keys     = require('./config/keys');
const app      = express();
const port     = process.env.PORT || 5000;

require('./config/passport')(passport);

app.use('/auth', auth);

// ******** MongoDB Connection ******** //
mongoose.Promise = global.Promise; // Map global promise - get rid of warning
mongoose.connect(keys.mongoURI, { useNewUrlParser: true }) // Connect
.then(() => console.log('MongoDB Connected...')) // when success
.catch(err => console.log(err)); // when fail
// ******** MongoDB Connection ******** //

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
