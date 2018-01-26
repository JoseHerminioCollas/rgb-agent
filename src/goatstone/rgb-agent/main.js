var express = require('express')
var router = express.Router()
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
let EventEmitter = require('events').EventEmitter
const Rx = require('rx')

const mqttClient = require('goatstone/rgb-agent/mqtt-client/client')
const rXEngine = require('goatstone/rgb-agent/engine/rx-engine')
const chaseEngine = require('goatstone/rgb-agent/engine/chase-engine')
const moveEngine = require('goatstone/rgb-agent/engine/move-engine')
const chaseEffect = require('goatstone/rgb-agent/effect/chase')
const patterns = require('goatstone/rgb-agent/patterns/patterns')
// routes
const rgb = require('goatstone/rgb-agent/routes/rgb')
const index = require('goatstone/rgb-agent/routes/index')

const scriptArray = patterns.glow

var startEvent = new EventEmitter()
let start$ = Rx.Observable.fromEvent(startEvent, 'data')
let stopEvent = new EventEmitter()
const stop$ = Rx.Observable.fromEvent(stopEvent, 'data')
let resetEvent = new EventEmitter()
const reset$ = Rx.Observable.fromEvent(resetEvent, 'data')
const colorEvent = new EventEmitter()
const effectEvent = new EventEmitter()

colorEvent.on('red', level => {
 mqttClient.red(level)    
})
colorEvent.on('green', level => {
 mqttClient.green(level)    
})
colorEvent.on('blue', level => {
 mqttClient.blue(level)    
})

effectEvent.on('chase', x => chaseEffect(chaseEngine, mqttClient))
// effectEvent.emit('chase', 1)

// use Rx to drive the frame push
const rXESub = rXEngine(start$, stop$, reset$, scriptArray, 1000)
rXESub.subscribe(data => {
  // send frames through the MQTT client
  mqttClient.frame(data)
})
startEvent.emit('data', 1)
// moveEngine(startEvent, stopEvent, resetEvent)

// app
var app = express()
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', index)
app.use('/rgb', rgb(startEvent, stopEvent, resetEvent, colorEvent, effectEvent))
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app