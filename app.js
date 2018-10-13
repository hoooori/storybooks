const express      = require('express');
const exphbs       = require('express-handlebars');
const mongoose     = require('mongoose');
const passport     = require('passport');
const keys         = require('./config/keys');
const cookieParser = require('cookie-parser');
const session      = require('express-session');
const app          = express();
const port         = process.env.PORT || 5000;

// Load Routes
const index = require('./routes/index');
const auth  = require('./routes/auth');

require('./models/User');
require('./config/passport')(passport);


app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(cookieParser());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize());
app.use(passport.session());
// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
})

// User Routes
app.use('/', index);
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
