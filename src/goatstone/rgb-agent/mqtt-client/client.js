
function mqttClient(broker, colorEvent, frameEvent, effecEvent, logger) {

  broker.on('connect', function () {
    broker.subscribe('ping')
  })
  broker.on('ping', function (topic, message = 'default ping message') {
    logger.log('mqtt', 'ping', {
      message
    })
  })

  colorEvent.on('color', values => {
    frame(values)
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

  effecEvent.on('off', effectOff)

  function red (level) {
    broker.publish('feather-one:light:red', level)
  }
  function green (level) {
    broker.publish('feather-one:light:green', level)
  }
  function blue (level) {
    broker.publish('feather-one:light:blue', level)
  }
  function frame(data) {
    broker.publish('feather-one:light:red', (data.red).toString())
    broker.publish('feather-one:light:green', (data.green).toString())
    broker.publish('feather-one:light:blue', (data.blue).toString())
  }
  function effectOff() {
    broker.publish('feather-one:light:blue', 'off')    
  }
}

module.exports = mqttClient