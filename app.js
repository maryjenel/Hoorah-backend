const express = require('express');
const app = express();

require('dotenv').config();


const feedRoute = require('./routes/feed');
app.use(feedRoute);


app.use((err, req, res, next) => {
    if(err.statusCode) {
        res.status(err.statusCode).send(err.message);
    } else {
        console.log(err);
        res.status(500).send('Something unexpected happened');
    }
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Server Started');
});