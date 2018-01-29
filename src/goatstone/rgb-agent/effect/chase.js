// chase effect
module.exports = function chaseEffect(chaseEngine, colorEvent){
  let cESub = chaseEngine()
  const colors = ['red', 'green', 'blue']
  let level = 0
  let color = 0
  cESub.subscribe( x => {
    colorEvent.emit(colors[color], level )
    color = (color >= colors.length - 1)? 0 : color + 1
    level = (color <= 0)? Math.abs(level - 150) : level
  })
}
