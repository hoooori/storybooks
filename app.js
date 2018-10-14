const express      = require('express');
const path         = require('path');
const exphbs       = require('express-handlebars');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
const passport     = require('passport');
const keys         = require('./config/keys');
const cookieParser = require('cookie-parser');
const session      = require('express-session');
const port         = process.env.PORT || 5000;

// Load Models
require('./models/User');
require('./models/Story');

// Passport model
require('./config/passport')(passport);

// Load Routes
const index   = require('./routes/index');
const auth    = require('./routes/auth');
const stories = require('./routes/stories');

// ******** MongoDB Connection ******** //
mongoose.Promise = global.Promise; // Map global promise - get rid of warning
mongoose.connect(keys.mongoURI, { useNewUrlParser: true }) // Connect
.then(() => console.log('MongoDB Connected...')) // when success
.catch(err => console.log(err)); // when fail
// ******** MongoDB Connection ******** //

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
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

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// User Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
