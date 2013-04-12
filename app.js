
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express()
  , routes = require('./routes')
  , user = require('./routes/user')
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , path = require('path');



app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon(__dirname + '/public/favicon.ico', {
    maxAge: 2592000000
  }));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/event/:subid', routes.event);
app.post('/event/:subid', routes.attendevent);
app.get('/user/:googleid', routes.get_by_googleid);
app.get('/event/cancel/:event_id/:googleid', routes.event_cancel);



app.get('/update/:id', routes.update);
app.post('/update/:id', routes.set);
app.get('/new', routes.new);
app.get('/test', routes.test);
app.get('/users', user.list);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
