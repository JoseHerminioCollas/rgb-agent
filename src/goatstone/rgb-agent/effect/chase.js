// chase effect
module.exports = function chaseEffect(chaseEngine, mqttClient){
  let cESub = chaseEngine()
  const colors = ['red', 'green', 'blue']
  let level = 0
  let color = 0
  cESub.subscribe( x => {
    // TODO mqttClient.setColor(COLOR.RED).setLevel(1).publish()
    mqttClient[colors[color]]((level).toString())
    color = (color >= colors.length - 1)? 0 : color + 1
    level = (color <= 0)? Math.abs(level - 150) : level
    console.log('chase', color)
  })
}
