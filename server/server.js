const path = require('path'),
      express = require('express'),
      massive = require('massive'),
      cors = require('cors'),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      CTRL = require('./controller/controller.js'),
      passport = require('passport'),
      auth0Strategy = require('passport-auth0'),
      env = require('dotenv').config({path: './server/config/.env'}),
      app = express(),
      port = 3000;
      
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));

const corsOptions = {
  origin: function (origin, callback) {
    if (true) {
      console.log("origin is " + origin);
      callback(null, true);
    }
    else callback(new Error("Not Allowed by CORS"));
  },
  credentials: true
}

// database

massive({
  host:process.env.POSTGRES_HOST,
  port:process.env.POSTGRES_PORT,
  user:process.env.POSTGRES_USER,
  database:process.env.POSTGRES_DATABASE,
  password:process.env.POSTGRES_PASSWORD,
  ssl:true
}, { scripts: __dirname + '/db' }).then(db => {
  app.set('db', db);
});

// sessions

app.use(session({
  secret: process.env.SERVER_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(express.static(__dirname + '/../build')); 
// auth0 section

app.use(passport.initialize());
app.use(passport.session());

passport.use(new auth0Strategy({
  domain: process.env.AUTH_DOMAIN,
  clientID: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
  callbackURL: process.env.AUTH_CALLBACK,
}, function(accessToken, refreshToken, extraParams, profile, done) {
  const db = app.get('db')
  db.findUser([(profile.identities[0].user_id).toString()]).then((response)=>{
    if (response[0]) {
        return done(null, { user_id: response[0].user_id })
      } else {
      let first_name = '',
          last_name = '',
          name = '',
          email = '',
          picture = '',
          user_id = '',
          user_type = 'general',
          street_address = '',
          city = '',
          state = '',
          zipcode = '',
          phone_number = '',
          instructions = '';
      if (profile.name.givenName) {
        first_name = profile.name.givenName;
      }
      if (profile.name.familyName) {
        last_name = profile.name.familyName;
      }
      if (profile.displayName) {
        name = profile.displayName;
      } else if (profile.name.givenName && profile.name.familyName) {
        name = profile.name.givenName + ' ' + profile.name.familyName;
      }
      if (profile.identities[0].user_id) {
        user_id = profile.identities[0].user_id;
      } else if (profile.id) {
        user_id = profile.id;
      }
      if (profile.picture) {
        picture = profile.picture;
      }
      if (profile.email) {
        email = profile.email;
      } else if (profile.emails[0].value) {
        email = profile.emails[0].value;
      }
      db.createUser([name, first_name, last_name, email, picture, user_id, user_type, street_address, city, state, zipcode, phone_number, instructions]).then((response)=>{
        return done(null, { user_id: response[0].user_id });
      })
    }
  })
}));

passport.serializeUser(function (user, done) {
  console.log('SERIALIZING');
  done(null, user);
})

passport.deserializeUser(function (obj, done) {
  console.log('DESERIALIZING')
  const db = app.get('db');
  db.findUser([obj.user_id]).then((response) => { 
      return done(null, response[0])
  })
})

// endpoints

app.post('/submitFeedback', CTRL.submitFeedback);
app.get('/getMenu', CTRL.getMenu);
app.get('/filter/:tab/by/:type', CTRL.filterByType);
app.post('/saveStripeToken', CTRL.saveStripeToken);
app.get('/getStoreLocations', CTRL.getStoreLocations);
app.post('/getUserOrders', CTRL.getUserOrders);
app.post('/submitUserChange', CTRL.submitUserChange);

app.get('/auth', (req, res, next) => {
  console.log("start authentication");
  next();
}, passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {
  successRedirect: process.env.AUTH_SUCCESS,
  failureRedirect: process.env.AUTH_FAILURE
}))

app.get('/auth/me', cors(corsOptions), (req, res) => {
  if (!req.user) {
    console.log("USER NOT FOUND");
    res.status(404).send('USER NOT FOUND');
  }
  else {
    console.log("USER FOUND");
    res.status(200).send(req.user);
  }
});


app.get('/auth/logout/', (req, res) => {
  req.logOut();
  res.redirect(302,  process.env.REACT_APP_HOST)
})

// finish
app.get('*', (req, res)=>{
  console.log(req.originalUrl)
  res.sendFile(path.join(__dirname, '../build/index.html'));
})

app.listen(port, ()=> console.log(`listening on port ${port}`));