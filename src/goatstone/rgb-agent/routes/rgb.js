var express = require('express');
var router = express.Router();
function rgb (startEvent, stopEvent, resetEvent, colorEvent) {
  return router.post('/light/:property/:level', function(req, res, next) {
    // console.log('rgb: ', req.params)
    // console.log('rgb: ', req.query)
    const property = req.params.property
    const level = req.params.level
    if (property === 'red') {
      colorEvent.emit('red', level)
    }
    else if (property === 'green') {
      colorEvent.emit('green', level)
    }
    else if (property === 'blue') {
      colorEvent.emit('blue', level)
    }
    else if (property === 'effect') {
    }
    // the effect called 'chace' an effect is a property of the light
    // 0  for off, 1 for on
    else if (property === 'chase' && level === '0') {
    }
    else if (property === 'chase' && level === '1') {
    }
    else if (property === 'rx' && level === '1') {
      startEvent.emit('data', '1')
    }
    const msg = `::: ${new Date()}`
    console.log(msg )
    res.send(msg)
    });
}
module.exports = rgb