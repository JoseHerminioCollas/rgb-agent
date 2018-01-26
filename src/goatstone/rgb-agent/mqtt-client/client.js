var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://192.168.0.10')
var Rx = require('rx')

client.on('connect', function () {
  client.subscribe('ping')
})
client.on('ping', function (topic, message) {
  console.log(message.toString())
})
function chaseOn () {
     rep3()
}
function chaseOff () {
    stop()
}
function glow () {
  console.log('glow')
}
function red (level) {
  client.publish('feather-one:light:red', level)
}
function green (level) {
  client.publish('feather-one:light:green', level)
}
function blue (level) {
  client.publish('feather-one:light:blue', level)
}
const mqttClient = {chaseOn, chaseOff, glow, red, green, blue}
module.exports = mqttClient

let a = Array.from(new Array(100))
    .map((x, i) => (i))
let f = function () {
    let d = 100
    let inc = 50
    let mult = 1
    let max = 2500
    let min = d
    return function () {
        mult = (d < min || d > max) ? mult * -1 : mult
        d = d + (inc * mult)
        return d
    }
}
const colors = ['red', 'green', 'blue']
let level = 0
let color = 0
let g = f()
let subs
function rep3 () {
  subs = Rx.Observable
      .from(a)
      .map(v => Rx.Observable.return(v).delay(g()))
      .concatAll()
      .subscribe(x => {
        client.publish('feather-one:light:' + colors[color], (level).toString())
        color = (color >= colors.length - 1)? 0 : color + 1
        level = (color <= 0)? Math.abs(level - 50) : level
        console.log('xxxx', color)
      },
      x => console.log('aa', x),
      x => {
        rep3()
        console.log('restart')
      })
}
function stop () {
  console.log('subs: ',subs)
  //subs.unsubscribe()
}
function rep4 () {
  Rx.Observable
      .from(a)
      .map(v => Rx.Observable.return(v).delay(g()))
      .concatAll()
      .subscribe(x => {
        client.publish('feather-one:light:red', (level).toString())
        client.publish('feather-one:light:green', (level).toString())
        // client.publish('feather-one:light:blue', (level).toString())
        level = (level <= 0)? 200: 0
        console.log('xxxxx', level)
      },
      x => console.log('aa', x),
      x => {
        rep4()
        // console.log('bbb', x)
      })
}

function rep(c, n) {
  client.publish('feather-one:light:red',  (n).toString())
  n = (n > 200)? 0 : n + 10
  console.log('xx', n)
//  if (c > 3) return
  setTimeout(x => rep(++c, n), 1000)
}
let isStopped = false
function rep2(count, level, color) {
  if (isStopped) return
  const colors = ['red', 'green', 'blue']
  client.publish('feather-one:light:' + colors[color], (level).toString())
  color = (color >= colors.length - 1)? 0 : color + 1
  level = (color <= 0)? Math.abs(level - 100) : level
  console.log('xx', color)
  setTimeout(x => rep2(++count, level, color), 1000) 
}
