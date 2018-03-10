var express = require('express')
var router = express.Router()

function rgbLightColor(colorEvent) {
  return router.post('/:red/:green/:blue', function(req, res, next) {
    const red = parseInt(req.params.red)
    const green = parseInt(req.params.green)
    const blue = parseInt(req.params.blue)
    const msg = `: ${new Date()} : ${red} ${green} ${blue} `
    colorEvent.emit('color', {red, green, blue})
    res.send(msg)
  })  
}

module.exports = rgbLightColor