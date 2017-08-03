const express = require('express');
const app = express();
const session = require('express-session');
// const setupPassport = require('./passport');
const bodyParser = require('body-parser');
const router = require('./router')(express);
const port = process.env.PORT || 3030;


//axios used for API call
var axios = require('axios')
// var redis = require('redis');
// var client = redis.createClient({
//     host: 'localhost',
//     port: 6379
// });

// client.on('error', function(err){
//     console.log(err);
// });

// handlebars used to created dynamic website which loads updated information live
const hb = require('express-handlebars');

//connecting express with handlebars - 'main' is the main page display located in the layouts folder; multiple main page layouts can be created and used to set overall browser skeleton
app.engine('handlebars', hb({
    defaultLayout: 'main',
    //helper is a customized function to run within your handlebars to filter information retrived
    helper:{
    }
}));

app.set('view engine', 'handlebars');

//this is used for hashing the current user session to prevent anyone who can hack into the user session. session auto hash the password 'canBeAnyPassword' to create security
app.use(session({
    secret: 'canBeAnyPassword'
}));

app.use(bodyParser());

// setupPassport(app);

app.use('/', router);

app.listen(port);
console.log('listening on port ', port);
