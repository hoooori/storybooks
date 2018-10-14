const express        = require('express');
const path           = require('path');
const exphbs         = require('express-handlebars');
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const mongoose       = require('mongoose');
const passport       = require('passport');
const keys           = require('./config/keys');
const cookieParser   = require('cookie-parser');
const session        = require('express-session');
const port           = process.env.PORT || 5000;

// Load Models
require('./models/User');
require('./models/Story');

// Passport model
require('./config/passport')(passport);

// Load Routes
const index   = require('./routes/index');
const auth    = require('./routes/auth');
const stories = require('./routes/stories');

// Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs');

// ******** MongoDB Connection ******** //
mongoose.Promise = global.Promise; // Map global promise - get rid of warning
mongoose.connect(keys.mongoURI, { useNewUrlParser: true }) // Connect
.then(() => console.log('MongoDB Connected...')) // when success
.catch(err => console.log(err)); // when fail
// ******** MongoDB Connection ******** //

const app = express();

/******************** Middleware ********************/
// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method Override
app.use(methodOverride('_method'));

// Handlebars
app.engine('handlebars', exphbs({
  helpers: {
    truncate:   truncate,
    stripTags:  stripTags,
    formatDate: formatDate,
    select:     select,
    editIcon:   editIcon
  },
  defaultLayout: 'main'
}));
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
/******************** Middleware ********************/

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// User Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
