var express = require('express')
var router = express.Router()
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
let EventEmitter = require('events').EventEmitter
const Rx = require('rx')

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://192.168.0.10')

const mqttClient = require('goatstone/rgb-agent/mqtt-client/client')
const rXEngine = require('goatstone/rgb-agent/engine/rx-engine')
const moveEngine = require('goatstone/rgb-agent/engine/move-engine')

// routes
const rgb = require('goatstone/rgb-agent/routes/rgb')
const index = require('goatstone/rgb-agent/routes/index')

const scriptArray = [
  {red: 10, green: 100, blue: 200},
  {red: 200, green: 100, blue: 10},
  {red: 10, green: 200, blue: 100},
  ]

var startEvent = new EventEmitter()
let start$ = Rx.Observable.fromEvent(startEvent, 'data')
let stopEvent = new EventEmitter()
const stop$ = Rx.Observable.fromEvent(stopEvent, 'data')
let resetEvent = new EventEmitter()
const reset$ = Rx.Observable.fromEvent(resetEvent, 'data')

 mqttClient.red('100')    

const colorEvent = new EventEmitter()
colorEvent.on('red', level => {
 mqttClient.red(level)    
})
colorEvent.on('green', level => {
 mqttClient.green(level)    
})
colorEvent.on('blue', level => {
 mqttClient.blue(level)    
})
//mqttClient.chaseOn()

const rXESub = rXEngine(start$, stop$, reset$, scriptArray)
rXESub.subscribe(data => {

  // drive the MQTT calls 
  client.publish('feather-one:light:red', (data.red).toString())
  client.publish('feather-one:light:green', (data.green).toString())
  client.publish('feather-one:light:blue', (data.blue).toString())

  console.log('data!!!: ', data.red)
})

moveEngine(startEvent, stopEvent, resetEvent)

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
app.use('/rgb', rgb(startEvent, stopEvent, resetEvent, colorEvent))
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