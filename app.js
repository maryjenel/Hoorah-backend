const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fileupload = require("express-fileupload");
require('dotenv').config();

const feedRoute = require('./routes/feed');
const authRoute = require('./routes/auth');
const verifyToken = require('./auth/AuthToken');
const isSecure = process.env.NODE_ENV === 'production' ? true : false;

app.use(express.json());
app.use(cookieParser());
app.use(fileupload());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1);
app.use(session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: isSecure,
      maxAge: 518400000
    }
}));

app.use((err, req, res, next) => {
    if(err.statusCode) {
        res.status(err.statusCode).send(err.message);
    } else {
        console.log(err);
        res.status(500).send('Something unexpected happened');
    }
});

/** For every route, try checking req headers for a JWT token value and verify that is valid
 * before allowing the request to go through
 */
// this route is to get an access token
app.use(authRoute);

// all following routes need a token
app.all('/*', verifyToken);
app.use(feedRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Server Started on port:' + PORT + ' and env = ' + process.env.NODE_ENV);
});