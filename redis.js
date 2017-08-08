//import destinations and tasks because it only needs to be pulled from server once
const Destination = require('./models').destination;
const Task = require('./models').task;


var redis = require('redis');
var client = redis.createClient({
    host: 'localhost',
    port: 6379
});
client.on('error', function(err){
    console.log(err);
});

Destination.findAll({
})
.then(function(destination){
    client.set('destination', JSON.stringify(destination),function(err, data){
        if(err){
            return console.log(err)
        }
        // client.get('destination', function (err, destination) {
        //     console.log(destination)
        // })
    })
})
Task.findAll({
})
.then(function(task){
    client.set('task', JSON.stringify(task),function(err, data){
        if(err){
            return console.log(err)
        }
    })
})

module.exports = client
