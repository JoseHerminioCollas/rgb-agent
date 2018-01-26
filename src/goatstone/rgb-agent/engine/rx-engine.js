const Rx = require('rx')

function rXEngine(start$, stop$, reset$, scriptArray){
    
    return Rx.Observable.merge(
        start$.flatMapLatest(() =>
                             Rx.Observable
                             .interval(2000)
                             .takeUntil(stop$)
                            ).map((x) => {
                                console.log(scriptArray[ (x % scriptArray.length) ])
                                return scriptArray[ (x % scriptArray.length) ]
                            }),
        reset$.map(() => 0)
    )
        .take(49)
}
module.exports = rXEngine
