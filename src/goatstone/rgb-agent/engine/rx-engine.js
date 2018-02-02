const Rx = require('rx')

function rXEngine(start$, stop$, reset$, intervalStart){
    
    return Rx.Observable.merge(
        start$.flatMapLatest(() =>
            Rx.Observable
            .interval(intervalStart)
            .takeUntil(stop$))
            .map( i => {
                return i
            }),
        reset$.map(() => 0)
    )
}

module.exports = rXEngine
