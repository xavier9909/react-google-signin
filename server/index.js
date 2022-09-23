const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const Login = require('./models/loginModel');
const { authenticateUser } = require('./controller/auth');
const secretkey = require('./config/secret.json');

const app = express();
var cors = require('cors');

app.use(cors());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.post('/login/user', async (req, res) => {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const { authId } = req.body;

    try {
        //check if passed token is valid
        const ticket = await client.verifyIdToken({
            idToken: authId,
            audience: process.env.CLIENT_ID
        });

        //get metadata from the id token, to be saved in the db
        const { name, email, picture } = ticket.getPayload();

        //this value will be passed thru cookie
        const loginToken = jwt.sign(`${email}`, secretkey.key);

        //upsert is true, this option enables mongoose to create a new entry if there is no existing record matching the filter
        await Login.findOneAndUpdate({
            email
        }, {
            name,
            picture
        }, {
            upsert: true
        });

        //creating a cookie name "login", which will expire after 360000 milliseconds from the time of creation
        //the value of the cookie is a jwt, created using the email id of the google user
        //later on each call we will deconde this message using secret key and check if user is authenticated

        res.status(200).cookie('login', loginToken, { expire: 360000 + Date.now() }).send({
            success: true
        });
    }
    catch (e) {
        res.status(500).send({
            error: e
        });
    }
});


app.get('/user/authenticated/getAll', authenticateUser, async (req, res) => {
    //authenticateUser is the middleware where we check if the use is valid/loggedin
    try {
        const data = await Login.find({});
        res.status(200).send({
            users: data
        });
    }
    catch (e) {
        res.status(500).send({
            error: e
        });
    }
});


app.get('/logout/user', async (req, res) => {
    //logout function
    try {
        res.clearCookie('login').send({
            'success': true
        });
    }
    catch (e) {
        res.status(500).send({
            error: e
        });
    }
});


app.get('/user/checkLoginStatus', authenticateUser, async (req, res) => {
    //check if user is logged in already
    try {
        res.status(200).send({
            'success': true
        });
    }
    catch (e) {
        res.status(500).send({
            error: e
        });
    }
});

app.listen(9191);