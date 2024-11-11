// * * * Fonction CLOG à regroupement * * *
exports.clog = function clog(...tb) {
    let deb = (tb.length > 1) ;
    for (let ob of tb){
        if(deb) { console.groupCollapsed(ob) ; deb = false ;}
        else    { console.log(ob)    ; }
    }   if(tb.length > 1) console.groupEnd() ;
}