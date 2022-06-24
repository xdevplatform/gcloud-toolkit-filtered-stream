const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const stream = require('./controllers/stream')
const rules = require('./controllers/rules')
const api = require('./controllers/api')
const token = require('./controllers/token')
const stripe = require('./controllers/stripe')

const app = express();
const PORT = process.env.PORT || 4060;

app.use(bodyParser.json({strict:false}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors()) 
app.post('*', cors()) 
app.use('/stream',stream);
app.use('/rules',rules);
app.use('/api', api)
app.use('/token', token)
app.use('/stripe',stripe);

app.listen(PORT, ()=>   {
    console.log("App listening on port",PORT);
    //stream.streamTweets();
});

module.exports = app;
