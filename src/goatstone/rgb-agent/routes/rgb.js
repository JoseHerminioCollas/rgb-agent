var express = require('express');
var router = express.Router();
function rgb (
  startEffectEvent, stopEvent, resetEvent, colorEvent, effectEvent) {
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
    else if (property === 'effect' && level === '1') {
      startEffectEvent.emit('data', '1')
    }
    else if (property === 'effect' && level === '0') {
      stopEvent.emit('data', '0')
    }
    else if (property === 'set') {
      effectEvent.emit('set', level)
    }
    const msg = `::: ${new Date()}`
    res.send(msg)
    });
}
module.exports = rgb