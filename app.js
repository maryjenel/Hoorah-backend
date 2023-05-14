const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Ensures that any incoming POST request has its body parsed from JSON into a 
// JavaScript object.  Required before the other app.use calls. 
app.use(express.json());
app.use(cookieParser());

const feedRoute = require('./routes/feed');
const verifyToken = require('./models/auth');


app.use((err, req, res, next) => {
    if(err.statusCode) {
        res.status(err.statusCode).send(err.message);
    } else {
        console.log(err);
        res.status(500).send('Something unexpected happened');
    }
});

/** For every route, try checking its headers for a JWT token value and verify that is valid
 * before allowing the request to go through
 */
app.all('/*', verifyToken);
app.use(feedRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Server Started on port:' + PORT);
});