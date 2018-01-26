var express = require('express');
var router = express.Router();
function rgb (startEvent, stopEvent, resetEvent, colorEvent, effectEvent) {
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
      effectEvent.emit('chase', 1000)
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