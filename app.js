const createError = require('http-errors'),
 express = require('express'),
 logger = require('morgan'),
 bodyParser = require('body-parser'),
 mongoose = require('mongoose'),
 cors = require('cors'),
 expressValidator = require('express-validator'),
 passport = require('passport'),
 indexRouter = require('./routes/index'),
 userRouter = require('./routes/user'),
 messageRouter = require('./routes/message');
 roomRouter = require('./routes/room');
 uploadRouter = require('./routes/upload');

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rn_app',
  { useNewUrlParser: true , useCreateIndex: true })
        .then(()=> { console.log("Connected to database!"); }) //notify if success
        .catch(err => {
          console.log(`Unable to connect to MongoDB!\nError: ${err}`); //notify of error that occurs
          process.exit(1); //terminate program
        });
mongoose.Promise = global.Promise; //config mongoose promise to use global promise
// Instantiate express
var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    let namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));
app.use(passport.initialize());
require('./config/passport')(passport);
app.disable('etag');
app.use('/doc', (req, res, next) =>{ res.sendFile('doc/index.html' , {root:  __dirname }) });
app.use('/api/v1/', indexRouter);
app.use('/api/v1/user', passport.authenticate('jwt', { session: false }), userRouter);
app.use('/api/v1/message', passport.authenticate('jwt', { session: false }), messageRouter);
app.use('/api/v1/room', passport.authenticate('jwt', { session: false }), roomRouter);
app.use('/api/v1/upload',  uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({ msg: err.message });
});

module.exports = app;
