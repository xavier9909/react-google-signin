
const mongoose = require('mongoose');
const config = require('../config/mongo.json');

const env = process.env.NODE_ENV || 'development';

const localUrl = `mongodb://${config[env].host}/${config[env].dbName}`;
const prodUrl = config[env]['env-variable'];

const connectionUrl = prodUrl ? prodUrl : localUrl;

const connect = mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
});

module.exports = connect;