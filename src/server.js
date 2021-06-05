require("dotenv").config();
const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const path = require('path')
//Globals
global.publicDir = path.resolve(__dirname + '/../public');
global.viewsDir = path.resolve(__dirname + '/../views');
//Express & basic middleware
const app = express()
const PORT = process.env.PORT || 5000;
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('tiny'))

// Session
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const pool = require('./config/db')
const sessionStore = new MySQLStore({}, pool)
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

// EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('views', __dirname + '/../views');
app.use(express.static(process.env.STATIC_DIR));

// Breadcrumbs implementation
const getBreadcrumbs = url => {
    let rtn = [{ name: "HOME", url: "/" }],
        acc = "", // accumulative url
        arr = url.substring(1).split("/");
    for (let i = 0; i < arr.length; i++) {
        acc = i != arr.length - 1 ? acc + "/" + arr[i] : null;
        rtn[i + 1] = { name: arr[i].toUpperCase(), url: acc };
    }
    return rtn;
}
app.use((req, res, next) => {
    req.breadcrumbs = getBreadcrumbs(req.originalUrl)
    next()
})

app.use('/', require('./routes/public'))
// Admin Panel routes
app.use('/admin', require('./routes/admin'))
app.use('/api/bookings', require('./routes/bookings'))
// API routes
app.use('/api/user', require('./routes/user'))
app.use('/api/menu', require('./routes/menu'))

app.listen(PORT, '0.0.0.0', () => console.log(`Listening on port ${PORT}`));
