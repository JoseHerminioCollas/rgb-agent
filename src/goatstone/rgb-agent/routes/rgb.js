var express = require('express');
var router = express.Router();
function rgb (startEffectEvent, stopEvent, resetEvent, colorEvent, chaseEvent) {
  return router.post('/light/:property/:level', function(req, res, next) {
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
    else if (property === 'chase') {
      chaseEvent.emit('chase', 1000)
    }
    else if (property === 'effect' && level === '1') {
      startEffectEvent.emit('data', '1')
    }
    else if (property === 'effect' && level === '0') {
      stopEvent.emit('data', '0')
    }
    const msg = `::: ${new Date()}`
    console.log(msg )
    res.send(msg)
    });
}
module.exports = rgb