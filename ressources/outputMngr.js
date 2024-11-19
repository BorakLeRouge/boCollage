"use strict" ;
const vscode = require('vscode');

// Gesion de l'ouput Manager
// const outputMngr = require('./outputMngr.js')
// - outputMngr.setContext(context) ;
// - outputMngr.clear() ; // Pour effacer
// - outputMngr.affich('message à afficher') ;

// Dans activate de l'extension :
//    const outputMngr = require('./outputMngr.js') ;
//    outputMngr.setContext(context) ;

// Dans au début de module
//    const outputMngr = require('./outputMngr.js') ;
//    // outputMngr.clogActivation('Activation Message') ;
//    function clog(...lg) { outputMngr.clog(lg) ; }

const outputMngr = {

    libelleOutput: 'BoCollage / Mathieu Fay'
    ,
    outputC: ''
    ,
    context: ''
    ,
    clogActif: false
}

// Alimentation du context pour récupérer les informations de l'extension
const setContext = function(context) {
    outputMngr.context = context ;
}

// Effacement de la sortie Output
const clear = function() {
    if(outputMngr.outputC == '') {
        outputMngr.outputC = vscode.window.createOutputChannel(outputMngr.libelleOutput) ;
    }
    outputMngr.outputC.clear() ;
    if (outputMngr.context != '') {
        outputMngr.outputC.appendLine(getTime() + ' - ' + outputMngr.context.extension.packageJSON.name + ' - v' + outputMngr.context.extension.packageJSON.version ) ;
    }
}

// Affichage du message
const affich = function(message) {
    if (outputMngr.outputC == '') {
        clear() ;
    }
    outputMngr.outputC.appendLine(getTime() + ' - ' + message) ;
    if (outputMngr.clogActif) { clog(message); }
}

const getTime = function() {
    let dt = new Date() ;
    return (''+dt.getHours()).padStart(2,'0') + ':' + (''+dt.getMinutes()).padStart(2,'0') + ':' + (''+dt.getSeconds()).padStart(2,'0') + '.' + (''+dt.getUTCMilliseconds()).padStart(3,'0') ;
}

// Appel console déplacé dans l'outputMngr
const clogActivation = function (msg='') {
    outputMngr.clogActif = true ;
    if (msg!='') { affich(msg) ; }
}
const clogInactivation = function () {
    outputMngr.clogActif = false ;
}

// a intégrer dans les scripts :
// const clog = function(...tb) { outputMngr.clog(tb) ; }
const clog = function(...tb) {
    if (outputMngr.clogActif) {
        let deb = (tb.length > 1) ;
        for (let ob of tb){
            if(deb) {
                if (typeof ob == 'string') {
                    console.groupCollapsed('%c'+ob, 'color: yellow') ; deb = false ;
                } else {
                    console.groupCollapsed(ob) ; deb = false ;
                }
            }
            else    {
                if (typeof ob == 'string') {
                    console.log('%c'+ob, 'color: yellow') ;
                } else  {
                    console.log(ob) ;
                }
            }
        }   if(tb.length > 1) console.groupEnd() ;
    }
}

module.exports = {
	affich, clear, setContext, clog, clogActivation, clogInactivation
}