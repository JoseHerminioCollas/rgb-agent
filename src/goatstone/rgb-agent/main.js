let EventEmitter = require('events').EventEmitter
const Rx = require('rx')

const mqttClient = require('goatstone/rgb-agent/mqtt-client/client')
const rXEngine = require('goatstone/rgb-agent/engine/rx-engine')
const chaseEngine = require('goatstone/rgb-agent/engine/chase-engine')
const chaseEffect = require('goatstone/rgb-agent/effect/chase')
const patterns = require('goatstone/rgb-agent/patterns/patterns')

// express server
const server = require('goatstone/rgb-agent/server.js')
// routes
const rgbLightColor = require('goatstone/rgb-agent/routes/rgb-light-color')
const rgbLightEffect = require('goatstone/rgb-agent/routes/rgb-light-effect')
const index = require('goatstone/rgb-agent/routes/index')

// MQTT broker
var broker  = (require('mqtt')).connect('mqtt://192.168.0.10')

// A pattern that will be used in the engine to get data
let scriptArray = patterns.emVehicle

const colorEvent = new EventEmitter()
const frameEvent = new EventEmitter()
const effectEvent = new EventEmitter()

// events for the effect engine
const startEffectEvent = new EventEmitter()
let start$ = Rx.Observable.fromEvent(startEffectEvent, 'data')
let stopEvent = new EventEmitter()
const stop$ = Rx.Observable.fromEvent(stopEvent, 'data')
let resetEvent = new EventEmitter()
const reset$ = Rx.Observable.fromEvent(resetEvent, 'data')


// The module that will actually call the MQTT Brocker
mqttClient(broker, colorEvent, frameEvent, effectEvent)

// timer stream drive the frame push
let timerEngineSubscription = rXEngine(start$, stop$, reset$,  1000)
timerEngineSubscription.subscribe(i => {
  let data = scriptArray[ (i % scriptArray.length) ]
  // send frames through the MQTT client
  frameEvent.emit('frame', data)
})

effectEvent.on('set', name => {
  if(!patterns[name]) return false
  // is it turned on? turn it on
  if(name === 'off'){
    stopEvent.emit('data', 0)
    return
  }
  scriptArray = patterns[name]
  startEffectEvent.emit('data', 1)
})

// start the chase effect, the interval of calls will vary
//chaseEffect(chaseEngine, colorEvent)

module.exports = server(index, rgbLightColor(colorEvent), rgbLightEffect(effectEvent))