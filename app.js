const express      = require('express');
const mongoose     = require('mongoose');
const passport     = require('passport');
const auth         = require('./routes/auth');
const keys         = require('./config/keys');
const cookieParser = require('cookie-parser');
const session      = require('express-session');
const app          = express();
const port         = process.env.PORT || 5000;

require('./models/User');
require('./config/passport')(passport);

app.use(cookieParser());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize());
app.use(passport.session());
// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
})
app.use('/auth', auth);

// ******** MongoDB Connection ******** //
mongoose.Promise = global.Promise; // Map global promise - get rid of warning
mongoose.connect(keys.mongoURI, { useNewUrlParser: true }) // Connect
.then(() => console.log('MongoDB Connected...')) // when success
.catch(err => console.log(err)); // when fail
// ******** MongoDB Connection ******** //

app.get('/', (req, res) => { res.send('It Works!'); })

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
