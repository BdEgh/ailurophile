const constants = require('./constants.js');
const appRoutes = require('./routes/images');
const authRoutes = require('./routes/auth');
const path = require('path');
const passport = require('passport')
const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});

require('./config/passport')(passport);

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: '123456',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(authRoutes, appRoutes);

mongoose.connect(constants.mongoUrl, {
    useNewUrlParser: true, useFindAndModify: false
});

let db = mongoose.connection;

db.once('open', function () {
    console.log('Connected to DB');
})

db.on('error', function () {
    console.log(err);
});

app.listen(3000, function () {
    console.log('Server started on port 3000');
});