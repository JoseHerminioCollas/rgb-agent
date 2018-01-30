var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://192.168.0.10')

function mqttClient(colorEvent, frameEvent) {

  client.on('connect', function () {
    client.subscribe('ping')
  })
  client.on('ping', function (topic, message) {
    console.log(message.toString())
  })

  colorEvent.on('red', level => {
    red(level)
  })
  colorEvent.on('green', level => {
    green(level)
  })
  colorEvent.on('blue', level => {
    blue(level)
  })

  frameEvent.on('frame', frameData => {
    frame(frameData)    
  })

  function red (level) {
    client.publish('feather-one:light:red', level)
  }
  function green (level) {
    client.publish('feather-one:light:green', level)
  }
  function blue (level) {
    client.publish('feather-one:light:blue', level)
  }
  function frame(data) {
    client.publish('feather-one:light:red', (data.red).toString())
    client.publish('feather-one:light:green', (data.green).toString())
    client.publish('feather-one:light:blue', (data.blue).toString())
  }
}

module.exports = mqttClient