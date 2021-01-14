require('dotenv').config();
const express = require('express'),
    session = require('express-session'),
    massive = require('massive'),
    authCtrl = require('./controllers/authController'),
    treasureCtrl = require('./controllers/treasureController'),
    auth = require('./middleware/authMiddleware'),
    { PORT, CONNECTION_STRING, SESSION_SECRET } = process.env,
    app = express();

app.use(express.json());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET
}));

//Connect to db
massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
}).then(db => {
    app.set('db', db);
    console.log(`Connected to database`);
});

//Endpoints
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

//Treasure Endpoints
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);

app.listen(PORT, console.log(`Listining on port: ${PORT}`));