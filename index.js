require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./Routers/userRouter');
const morgan = require('morgan');
var cors = require('cors');

const app = express();
const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT || 3001
const FRONTEND = process.env.FRONTEND

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use('/api', userRoute);
app.post('/api/login', (req, res) => {
  res.redirect('https://nproject-190cc.web.app/userdashboard')
});

app.get('/', (req, res) => {
    res.send('This is Vasanth Node Js API');
});

mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('connected to mongo db');
        app.listen(PORT, () => {
            console.log(`Port working in http://localhost:${PORT}`);
            console.log(`current working Cors is ${FRONTEND}`);
        });
    }).catch((error) => {
        console.log(error);
    });
