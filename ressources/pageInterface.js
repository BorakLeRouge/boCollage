// ==================================================================================================================
//  III  N   N  TTTTT  EEEEE  RRRR   FFFFF    A     CCC   EEEEE        GGG   EEEEE   SSS   TTTTT  III   OOO   N   N
//   I   NN  N    T    E      R   R  F       A A   C   C  E           G   G  E      S        T     I   O   O  NN  N
//   I   N N N    T    EEE    R   R  FFF    A   A  C      EEE         G      EEE     SSS     T     I   O   O  N N N
//   I   N  NN    T    E      RRRR   F      AAAAA  C      E           G  GG  E          S    T     I   O   O  N  NN
//   I   N   N    T    E      R  R   F      A   A  C   C  E           G   G  E          S    T     I   O   O  N   N
//  III  N   N    T    EEEEE  R   R  F      A   A   CCC   EEEEE        GGGG  EEEEE  SSSS     T    III   OOO   N   N
// ==================================================================================================================
// * * * Gestion de l'interface

const vscode = acquireVsCodeApi() ;


// ====================================================================================================================
//  M   M  EEEEE   SSS    SSS     A     GGG   EEEEE       RRRR   EEEEE   CCC   EEEEE  PPPP   TTTTT  III   OOO   N   N
//  MM MM  E      S      S       A A   G   G  E           R   R  E      C   C  E      P   P    T     I   O   O  NN  N
//  M M M  EEE     SSS    SSS   A   A  G      EEE         R   R  EEE    C      EEE    P   P    T     I   O   O  N N N
//  M   M  E          S      S  AAAAA  G  GG  E           RRRR   E      C      E      PPPP     T     I   O   O  N  NN
//  M   M  E          S      S  A   A  G   G  E           R  R   E      C   C  E      P        T     I   O   O  N   N
//  M   M  EEEEE  SSSS   SSSS   A   A   GGGG  EEEEE       R   R  EEEEE   CCC   EEEEE  P        T    III   OOO   N   N
// ====================================================================================================================
// * * * Reception Messages envoyés par la partie VSCode de l'application
window.addEventListener('message', event => {

    const message = event.data ; 

    if (message.action == 'affichage') {
    
        document.getElementById(message.cible).innerHTML = message.html ;

        vscode.postMessage({
            action:  'Affichage', 
            fichier: message.suivant,
            pos:     message.pos + 1,
            cible:   'contenu' + (message.pos + 1)
        }) ;

    }

} )


// ===============================================================================
//   1   EEEEE  RRRR   EEEEE         A    RRRR   RRRR   III  V   V  EEEEE  EEEEE
//  11   E      R   R  E            A A   R   R  R   R   I   V   V  E      E
//   1   EEE    R   R  EEE         A   A  R   R  R   R   I   V   V  EEE    EEE
//   1   E      RRRR   E           AAAAA  RRRR   RRRR    I    V V   E      E
//   1   E      R  R   E           A   A  R  R   R  R    I    V V   E      E
//  111  EEEEE  R   R  EEEEE       A   A  R   R  R   R  III    V    EEEEE  EEEEE
// ===============================================================================
// * * * 1ere Arrivée : demande de reception des parametres * * *
vscode.postMessage({
    action:  'Affichage', 
    fichier: '',
    pos:     0,
    cible:   'contenu0'
}) ;


// ================================================
//    A     CCC   TTTTT  III   OOO   N   N   SSS
//   A A   C   C    T     I   O   O  NN  N  S
//  A   A  C        T     I   O   O  N N N   SSS
//  AAAAA  C        T     I   O   O  N  NN      S
//  A   A  C   C    T     I   O   O  N   N      S
//  A   A   CCC     T    III   OOO   N   N  SSSS
// ================================================ 

function ouvrDoss(fichier, pos, cible) {
    vscode.postMessage({
        action:  'Affichage', 
        fichier: fichier,
        pos:     pos,
        cible:   cible
    }) ;
}

function ouvrFich(fichier) {
    vscode.postMessage({
        action:  'Ouvrir Fichier',
        fichier: fichier
    })
}


// * * * Actualiser l'affichage
function actualiser() {
    vscode.postMessage({
        action:  'Affichage', 
        fichier: '',
        pos:     0,
        cible:   'contenu0'
    }) ;
    
}

// =======================================================
//  RRRR    OOO   U   U  TTTTT  III  N   N  EEEEE   SSS
//  R   R  O   O  U   U    T     I   NN  N  E      S
//  R   R  O   O  U   U    T     I   N N N  EEE     SSS
//  RRRR   O   O  U   U    T     I   N  NN  E          S
//  R  R   O   O  U   U    T     I   N   N  E          S
//  R   R   OOO    UUU     T    III  N   N  EEEEE  SSSS
// =======================================================
// * * * Routines
function clog(...tb) {
    if(tb.length == 1) {
        console.log(tb[0]);
    } else {
        let first = true ;
        for (let c of tb) {
            if (first) {
                console.groupCollapsed(c) ;
                first = false ;
            } else {
                console.log(c) ;
        }   }  
        console.groupEnd() ;
}   }