var express = require('express')
var router = express.Router()

function rgbLightEffect(effectEvent) {
  return router.post('/:name', function(req, res, next) {
    const name = req.params.name
    const msg = `: ${new Date()} : ${name}  `
    effectEvent.emit('set', name)
    res.send(msg)
  })  
}
module.exports = rgbLightEffect