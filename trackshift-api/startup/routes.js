const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const error = require('../middleware/error');
const users = require("../routes/users");
const auth = require("../routes/auth");
const spotify = require("../routes/spotify");
const youtube = require("../routes/youtube");
const deezer = require("../routes/deezer");

module.exports = function(app) {
    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/spotify', spotify);
    app.use('/api/youtube', youtube);
    app.use('/api/deezer', deezer);
    app.use(error); 
}