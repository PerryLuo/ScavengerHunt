const express = require('express');
const app = express();
const session = require('express-session');
const setupPassport = require('./passportGoogle');
const bodyParser = require('body-parser');
const router = require('./router')(express);
const port = 3030;

// var redis = require('redis');
// var client = redis.createClient({
//     host: 'localhost',
//     port: 6379
// });

const hb = require('express-handlebars');
app.engine('handlebars', hb({
    defaultLayout: 'main',
    //helper is a customized function to run within your handlebars to filter information retrived
    helper:{
    }
}));
app.set('view engine', 'handlebars');
app.use(session({secret: 'canBeAnyPassword'}));
app.use(bodyParser());
app.use('/public', express.static('public'));

setupPassport(app);
app.use('/', router);
app.listen(3030);
//console.log('listening on port ', port);
