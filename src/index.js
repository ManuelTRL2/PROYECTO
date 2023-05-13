const { json } = require('express')
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};

// settings
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express(json));

// middlewares
dotenv.config({path: './env/.env'})
app.use(morgan('dev'));
app.use(cookieParser());  

// routes
app.use(require('./routes/router'));

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});
// static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/img/perfil')));
app.use(express.static(path.join(__dirname, 'public/img/fierro')));


// listening the Server
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});




