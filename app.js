const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./Routes/authRoutes');
const userRoutes = require('./Routes/user');
const { connectDb } = require('./db/connection')

const app = express();

connectDb();

app.options('*', cors());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const http = require('http').Server(app);
http.listen(process.env.PORT, () => console.log(`Listening on port: ${process.env.PORT}`));