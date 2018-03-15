let EventEmitter = require('events').EventEmitter
const Rx = require('rx')
const winston = require('winston')

const mqttClient = require('goatstone/rgb-agent/mqtt-client/client')
const patterns = require('goatstone/rgb-agent/patterns/patterns')
const effectEngine = require('goatstone/rgb-agent/engine/effect')

// express server
const server = require('goatstone/rgb-agent/server.js')

// routes
const rgbLightColor = require('goatstone/rgb-agent/routes/rgb-light-color')
const rgbLightEffect = require('goatstone/rgb-agent/routes/rgb-light-effect')
const index = require('goatstone/rgb-agent/routes/index')

// MQTT broker
var broker = (require('mqtt')).connect('mqtt://192.168.0.10')

const colorEvent = new EventEmitter()
const frameEvent = new EventEmitter()
const effectEvent = new EventEmitter()

const startEffectEvent = new EventEmitter()
const stopEvent = new EventEmitter()
const resetEvent = new EventEmitter()

mqttClient(broker, colorEvent, frameEvent, effectEvent, winston)
effectEngine(patterns, startEffectEvent, stopEvent, resetEvent, effectEvent, frameEvent)

module.exports = server(index, rgbLightColor(colorEvent), rgbLightEffect(effectEvent))