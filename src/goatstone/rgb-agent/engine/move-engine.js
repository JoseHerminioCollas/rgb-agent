function moveEngine(startEvent, stopEvent, resetEvent){
    startEvent.emit('data', '1');
    setTimeout(x => {
        console.log('timeout off')
        stopEvent.emit('data', 'b')
    }, 6000 )
    setTimeout(x => {
        console.log('timeout on')
        startEvent.emit('data', 'foo');
    }, 10000 )
}
module.exports = moveEngine
