const express = require('express');
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('./config/key');
const env = require('dotenv').config();
const path = require('path');


mongoose.connect( config.mongoURI,{
  useNewUrlParser: true, useUnifiedTopology: true,
  useCreateIndex: true, useFindAndModify: false
})
        .then(() => console.log('Db connected'))
        .catch((err) => console.log(err.message));

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/users',require('./routes/users'));
app.use('/uploads',express.static('uploads'));
app.use('/api/video', require('./routes/video'));
app.use('/api/subscribe', require('./routes/subscribe'));
app.use('/api/comment', require('./routes/comment'));
app.use('/api/like', require('./routes/likes'));



const port = process.env.PORT || 5000;
console.log(process.env.NODE_ENV);
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});